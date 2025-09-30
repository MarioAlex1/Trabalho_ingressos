const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Servidor HTTP nativo funcionando!', url: req.url }));
});

server.listen(3001, () => {
    console.log('Servidor HTTP nativo na porta 3001');
});