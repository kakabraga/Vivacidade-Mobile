# 📱 Vivacidade

**Vivacidade: Estímulo e Criatividade para Idosos** é um projeto extensionista que visa promover a inclusão digital de pessoas idosas por meio da criatividade. O projeto consistiu na codificação de um aplicativo mobile desenvolvido para facilitar o acesso e compartilhamento de tutoriais de atividades manuais, como artesanato, costura, culinária, entre outras.

A iniciativa busca estimular o aprendizado, a autonomia e o engajamento social dos idosos, oferecendo uma interface amigável e acessível, com foco na simplicidade de uso e na valorização da experiência individual.
---

## ✨ Funcionalidades

- 📋 Cadastro e login de usuários
- 🧵 Criação de posts com tutoriais passo a passo
- 🖼️ Upload de imagens dos tutoriais
- 🔍 Visualização de tutoriais por outros usuários
- ❤️ Interface acessível e amigável para idosos

---

## 🧑‍💻 Tecnologias Utilizadas

### Front-end (Mobile):
- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- Context API para autenticação
- AsyncStorage para persistência de token

### Back-end:
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MySQL](https://www.mysql.com/)
- Autenticação com JWT
- Upload de imagens com `multer`

---
## 🚀 Como Rodar o Projeto

### Pré-requisitos
- Node.js v18+
- MySQL
- Expo CLI (`npm install -g expo`)
- Docker (opcional)

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/vivacidade.git
cd vivacidade
```
### 2. Rodar o back-end
```bash
cd backend
npm install
node index.js
```
### 3. Rodar o app mobile
```bash
cd front-end
npm install
npx expo start --tunnel
```
🌐 Acesso a Imagens no Mobile
Para visualizar imagens enviadas (uploads), certifique-se de que o endereço IP do back-end esteja acessível no celular (rede local ou usar tunelamento via ngrok).

📄 Licença
Este projeto está sob a licença MIT.

🙋‍♀️ Autoria
Desenvolvido por Caue, com foco na acessibilidade e bem-estar de pessoas idosas.

---


