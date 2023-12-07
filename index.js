const server = require('./server')

const HOST = 'localhost'
const PORT = 12345

server.listen(PORT, ()=>{`Server Running at ${HOST}:${PORT}`})