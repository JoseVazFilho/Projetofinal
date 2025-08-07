# 🎒 Sistema de Achados e Perdidos - UFG

Aplicação completa para registro e gerenciamento de objetos perdidos, com funcionalidades de autenticação, upload de imagem, visualização pública e filtros por tipo de objeto e local.

---

## 📦 Tecnologias Utilizadas

### 🔧 Backend
- Node.js v20
- Express
- Prisma (ORM)
- PostgreSQL
- TypeScript
- Multer (Upload de imagens)
- JWT (Autenticação)
- ts-node-dev

### 🖥️ Frontend
- React
- Vite
- TypeScript
- Tailwind CSS
- Axios

---

## 🚀 Funcionalidades

- ✅ Cadastro de usuários com login via JWT
- ✅ Cadastro de itens com imagem (upload)
- ✅ Filtros por tipo de objeto e local
- ✅ Listagem pública de itens perdidos
- ✅ Visualização com imagem
- ✅ Edição de itens cadastrados
- ✅ Tela de login e logout

---

## 🛠️ Instalação

### 📁 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/achados-perdidos.git
cd achados-perdidos

## ⚙️ 2. Configuração do Backend
cd backend
npm install

## 📄 Crie um arquivo .env com:
DATABASE_URL="postgresql://usuario:senha@localhost:5432/achados_perdidos"
JWT_SECRET="segredo123"
PORT=3000

##🔧 Execute as migrações Prisma:
npx prisma migrate dev --name init

## ▶️ Inicie o servidor:
npm run dev

##🌐 3. Configuração do Frontend
cd ../frontend
npm install
npm run dev
Acesse: http://localhost:5173

## 🧪 Endpoints da API
| Método | Rota           | Protegida | Descrição                    |
| ------ | -------------- | --------- | ---------------------------- |
| POST   | /auth/register | ❌         | Registro de novo usuário     |
| POST   | /auth/login    | ❌         | Login e retorno de token JWT |
| GET    | /items/public  | ❌         | Lista pública de itens       |
| GET    | /items         | ✅         | Lista privada de itens       |
| POST   | /items         | ✅         | Cria novo item com imagem    |
| PUT    | /items/\:id    | ✅         | Edita um item                |

##🖼️ Uploads
As imagens dos itens são armazenadas na pasta uploads/ no backend e servidas publicamente.

##👤 Autores
Jose Vaz Filho
Guilherme Oliveira Santos

