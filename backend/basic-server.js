console.log('Iniciando servidor...');

const http = require('http');

const server = http.createServer((req, res) => {
    console.log(`Requisição recebida: ${req.method} ${req.url}`);
    
    res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    });
    
    if (req.method === 'OPTIONS') {
        res.end();
        return;
    }
    
    res.end(JSON.stringify({
        message: 'Servidor HTTP básico funcionando!',
        url: req.url,
        method: req.method,
        timestamp: new Date().toISOString()
    }));
});

const port = 3001;

server.listen(port, () => {
    console.log(`✅ Servidor HTTP básico rodando na porta ${port}`);
});

server.on('error', (err) => {
    console.error('❌ Erro no servidor:', err);
});

// Manter o processo vivo
process.on('SIGINT', () => {
    console.log('\n🛑 Servidor sendo finalizado...');
    server.close(() => {
        console.log('✅ Servidor finalizado');
        process.exit(0);
    });
});