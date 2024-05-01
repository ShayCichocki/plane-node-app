import { Server, type Socket } from 'socket.io'

const io = new Server(8080, { cors: { origin: '*' } })

const users: Set<{ id: string; socket: Socket }> = new Set()
let currentNumber = 0;
io.on('connection', (socket: Socket) => {
    console.log('New user connected:', socket.id)
    const newUser = { id: socket.id, socket }
    users.add(newUser)
    newUser.socket.emit('user-entered', {id:newUser.id, currentNumber});
    // send all existing users a 'user-entered' event for the new user
    socket.broadcast.emit('user-entered', {id:newUser.id, currentNumber});

    socket.on('add', () => {
        currentNumber+=1;
        console.log(currentNumber)
        socket.broadcast.emit('add')
    });
    socket.on('subtract', () => {
        currentNumber-=1;
        socket.broadcast.emit('subtract');
    })
    socket.on('disconnect', () => {
        users.delete(newUser)
        socket.broadcast.emit('user-exited', newUser.id)
    })
})
