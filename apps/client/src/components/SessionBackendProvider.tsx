import {createContext, useContext, useEffect, useState} from 'react'
import {type SpawnResult} from './SessionBackend';
import {SessionBackend} from './SessionBackend';

export const SessionBackendContext = createContext<SessionBackend | null>(null)

export function SessionBackendProvider({
                                           spawnResult,
                                           children,
                                       }: {
    spawnResult: SpawnResult
    children: React.ReactNode
}) {
    const {url, status_url} = spawnResult
    const [backend, setBackend] = useState<SessionBackend | null>(null)

    useEffect(() => {
        setBackend(new SessionBackend(url, status_url))
        return () => {
            backend?.destroy()
        }
    }, [url, status_url])
    return (
        <SessionBackendContext.Provider value={backend}>
            {backend ? children : null}
        </SessionBackendContext.Provider>
    )
}

export function useReady(): boolean {
    const backend = useContext(SessionBackendContext)
    if (!backend) throw new Error('useReady must be used within a SessionBackendContext / Provider')
    const [isReady, setIsReady] = useState(backend.isReady())

    useEffect(() => {
        return backend.onReady(() => setIsReady(true))
    }, [backend])

    return isReady
}
