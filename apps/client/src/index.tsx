import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
fetch('http://localhost:3000/spawn', {
    method: "POST",
    mode: "cors",
    headers: new Headers({
        'accept': 'application/json',
        'content-type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    })
}).then(r =>r.json()).then(data => {
    root.render(
        <React.StrictMode>
            <App spawnResult={data} />
        </React.StrictMode>
    );
})


