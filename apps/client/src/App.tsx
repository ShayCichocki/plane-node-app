import React, {useEffect} from 'react';
import './App.css';
import {styled} from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import {
    SocketIOProvider, useSend, useEventListener
} from "./components/SocketIoProvider";
import {
    SessionBackendProvider, useReady
} from "./components/SessionBackendProvider";

const Item = styled(Paper)(({theme}) => ({
    backgroundColor: '#EE',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

type UserEntered = {
    id: string;
    currentNumber: number;
}

function MyComponent() {
    const sendEvent = useSend()
    const ready = useReady()
    const [num, setNum] = React.useState(0);
    const addNumber = () => {
        setNum(num + 1);
        sendEvent('add', {});
    }
    const subtractNumber = () => {
        setNum(num - 1);
        sendEvent('subtract', {});
    }
    useEventListener<UserEntered>('user-entered', (x) => {
        console.log("USER ENTERED", x)
        setNum(x.currentNumber)
    })
    useEventListener<string>('add', (id) => {
        setNum(num+1)
    })
    useEventListener<string>('subtract', (id) => {
        setNum(num-1)
    })
    return (
        (ready ? (
            <Grid container spacing={2}>
                <Grid item xs={2}/>
                <Grid item xs={8}>
                    <Item>{num}</Item>
                </Grid>
                <Grid item xs={2}/>
                <Grid item xs={2}/>
                <Grid item xs={4}>
                    <Item>
                        <button onClick={addNumber}>ADD</button>
                    </Item>
                </Grid>

                <Grid item xs={4}>
                    <Item>
                        <button onClick={subtractNumber}>Subtract</button>
                    </Item>
                </Grid>
            </Grid>) : <></>)
    )
}

function App({spawnResult}: any) {
    return (
        <>
            <SessionBackendProvider spawnResult={spawnResult}>
                <SocketIOProvider url={spawnResult.url}>
                    <MyComponent/>
                </SocketIOProvider>
            </SessionBackendProvider>
        </>
    );
}

export default App;
