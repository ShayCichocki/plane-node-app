export type Status = string
export type StatusStreamEvent = { state: Status; time: string }
export type SpawnResult = {
    backend_id: string;
    drone: null;
    secret_token: string;
    spawned: boolean;
    status: string;
    status_url: string;
    subdomain: string;
    token: string;
    url: string;
};
export class SessionBackend {
    private streamReader: ReadableStreamDefaultReader | null = null
    readonly statuses: Status[] = []
    private _isReady: boolean = false
    private _onReady: (() => void)[] = []

    constructor(
        readonly url: string,
        readonly status_url: string,
    ) {
        this.waitUntilReady(status_url, url)
    }

    // Private method to set the session as ready and execute callbacks
    private _setReady() {
        this._isReady = true
        this._onReady.forEach((cb) => cb())
        this._onReady = []
    }

    private waitUntilReady = async (statusUrl: string, url:string) => {
        const res = await fetch(statusUrl, { mode: 'cors', cache: 'no-store' })
        if (!res.ok) {
            throw new Error(
                `An error occured while fetching plane backend status: ${await res.text()}`,
            )
        }
        const status = await res.text()

        if (status.includes('ready')) {
            this._setReady()
            return
        }
        if (!status.includes('starting') && !status.includes("waiting")) {
            throw new Error(`plane status is a Terminal state: ${status}`)
        }

        const response = await fetch(`${url}stream`, { cache: 'no-store' })
        if (!response.body)
            throw new Error('response to plane backend status stream did not include body')
        this.streamReader = response.body.pipeThrough(new TextDecoderStream()).getReader()
        while (this.streamReader !== null) {
            const result = await this.streamReader.read()
            const value = result.value as string
            if (result.done) {
                console.log('plane status stream closed by API')
                this.destroyStatusStream()
                break
            }

            const messages = value
                .split('\n')
                .map((v) => v.trim())
                .filter(Boolean)

            for (const msg of messages) {
                if (!msg?.startsWith('data:'))
                    throw new Error(`Unexpected message from SSE endpoint: ${msg}`)
                const text = msg.slice(5).trim()
                let data: StatusStreamEvent | null = null
                try {
                    data = JSON.parse(text) as StatusStreamEvent
                } catch (e) {
                    console.error(`Error parsing status stream message as JSON: "${text}"`, e)
                }
                if (data?.state === 'Ready') {
                    this._setReady()
                    this.destroyStatusStream()
                }
            }
        }
    }

    private destroyStatusStream = () => {
        if (this.streamReader) {
            this.streamReader.cancel()
            this.streamReader = null
        }
    }

    public destroy() {
        this.destroyStatusStream()
    }

    public isReady() {
        return this._isReady
    }

    public onReady(cb: () => void): () => void {
        if (this.isReady()) {
            cb()
        } else {
            this._onReady.push(cb)
        }
        return () => {
            if (this.isReady()) return
            this._onReady = this._onReady.filter((c) => c !== cb)
        }
    }
}