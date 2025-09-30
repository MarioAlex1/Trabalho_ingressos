const http = require('http');
const url = require('url');

console.log('🚀 Iniciando servidor HTTP simples...');

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');
    
    console.log(`📥 ${req.method} ${req.url}`);
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    if (req.method === 'GET' && parsedUrl.pathname === '/api/test') {
        console.log('✅ Endpoint /api/test acessado');
        const response = {
            message: 'Servidor HTTP funcionando!',
            method: req.method,
            url: req.url,
            timestamp: new Date().toISOString()
        };
        res.writeHead(200);
        res.end(JSON.stringify(response));
        return;
    }
    
    if (req.method === 'POST' && parsedUrl.pathname === '/api/tipos-ingressos') {
        console.log('✅ POST /api/tipos-ingressos');
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            console.log('Body recebido:', body);
            const response = {
                message: 'Endpoint tipos-ingressos funcionando!',
                received: body ? JSON.parse(body) : null,
                timestamp: new Date().toISOString()
            };
            res.writeHead(200);
            res.end(JSON.stringify(response));
        });
        return;
    }
    
    // 404 para outras rotas
    res.writeHead(404);
    res.end(JSON.stringify({error: 'Rota não encontrada'}));
});

const port = 3001;

server.listen(port, 'localhost', () => {
    console.log(`✅ Servidor HTTP rodando na porta ${port}`);
    console.log(`🌐 Teste: http://localhost:${port}/api/test`);
});

server.on('error', (err) => {
    console.error('❌ Erro no servidor:', err);
});

// Keep alive
console.log('🔄 Servidor aguardando conexões...');