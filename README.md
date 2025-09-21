# Eclipse - Plataforma de Gestão de Eventos e Ingressos Online

Sistema para gestão de eventos e venda de ingressos, desenvolvido com Vue.js no frontend e Node.js/Express no backend.

---

## 📋 Sobre o Projeto

O Eclipse facilita a compra e gestão de ingressos para eventos na cidade de Boa Viagem, reunindo shows, festas, palestras e outras atrações em uma plataforma única.

---

## 🏗️ Arquitetura

* **Frontend**: Vue.js 3 com componentes modulares, Tailwind CSS e Vue Router
* **Backend**: Node.js + Express + Sequelize ORM + SQLite
* **Camada de Domínio**: Classes com lógica de negócio (Usuário, Evento, Ingresso)

---

## 🚀 Funcionalidades

### Clientes

* Visualização de eventos
* Compra de ingressos online
* Gestão de ingressos adquiridos
* Autenticação básica

### Organizadores

* Criação e gestão de eventos
* Controle de capacidade e preços
* Cancelamento de eventos

### Técnicas

* Modo claro/escuro
* Interface responsiva
* Validação de ingressos
* Sistema de permissões por tipo de usuário

---

## 🛠️ Tecnologias

**Frontend**

* Vue.js 3, Vue Router
* Tailwind CSS, Headless UI

**Backend**

* Node.js, Express.js
* Sequelize ORM, SQLite

---

## 📦 Estrutura do Projeto

```
├── backend/
│   ├── src/
│   │   ├── classes/          # Classes de domínio
│   │   ├── models/           # Modelos Sequelize
│   │   ├── config/           # Configuração do banco
│   │   └── routes/           # Rotas da API
│   └── server.js             # Servidor principal
├── frontend/
│   ├── src/
│   │   ├── components/       # Componentes Vue
│   │   ├── views/            # Páginas Vue
│   │   ├── router/           # Rotas Vue
│   │   └── assets/           # Recursos estáticos
│   └── index.html
└── documento/                # Documentação do projeto
```

---

## 🔌 API Endpoints (Backend)

Base URL: `http://localhost:3000/api`

| Método | Endpoint       | Descrição            |
| ------ | -------------- | -------------------- |
| GET    | /usuarios      | Lista todos usuários |
| POST   | /usuarios      | Cria um novo usuário |
| GET    | /usuarios/\:id | Busca usuário por ID |
| PUT    | /usuarios/\:id | Atualiza usuário     |
| DELETE | /usuarios/\:id | Remove usuário       |

---

## 🔗 Integração Frontend ↔ Backend

* O backend roda em `http://localhost:3000/api`.
* No frontend, substitua dados de teste por chamadas à API usando **fetch** ou **Axios**.
* Exemplo:

```javascript
fetch('http://localhost:3000/api/usuarios')
  .then(res => res.json())
  .then(data => console.log(data))
```

* Componentes como `HomeCarousel.vue` usam dados temporários (`defaultLocations`); substitua por requisições ao backend.
* Para autenticação, crie endpoints no backend (`/login`, `/register`) e use tokens JWT ou outro método.

---

## 🚀 Como Executar

### Pré-requisitos

* Node.js v16+
* npm ou yarn

### Backend

```bash
cd backend
npm install
npm run dev   # Inicializa banco e sobe servidor
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

* Backend: `http://localhost:3000`
* Frontend: `http://localhost:5173`

---

## 📦 Scripts NPM

**Backend (`package.json`)**

```json
{
  "scripts": {
    "start": "node server.js",
    "init-db": "node init-db.js",
    "dev": "npm run init-db && node server.js"
  }
}
```

**Frontend (`package.json`)**

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

---

## 🔐 Segurança

* Validação de dados em todas as camadas
* Hashing de senhas
* Controle de acesso por tipo de usuário
* Tratamento de exceções

---

## 📈 Próximas Implementações

* Integração com gateway de pagamento
* Geração de QR Codes para ingressos
* Sistema de notificações
* Dashboard analítico para organizadores
* App mobile

---

## 👥 Equipe

* Francisco – Design & Protótipo
* Lauro – Frontend
* Kayron – Backend
* Mário – Backend
