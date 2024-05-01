import express from 'express';
import cors from 'cors';

const app = express();


app.use(cors())
app.post('/spawn', async (req, res) => {
    try {
        const response = await fetch('http://localhost:8080/ctrl/connect', {
            headers: {
                "content-type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({
                "key": {
                    "name": "aooosse",
                    "namespace": "games",
                    "tag": "drop-four"
                },
                "spawn_config": {
                    "executable": {
                        "image": "multiplayer-server:latest"
                    },
                    "lifetime_limit_seconds": 3600,
                    "max_idle_seconds": 600
                },
                "cluster": "",
                "user": "user-123"
            })
        });
        const body = await response.json();
        res.json(body);
    } catch (e) {
        console.log(e)
    }

});

app.listen(3000, () => {
    console.log("Listening on port 3000");
})