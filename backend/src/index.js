const express = require('express');
const cors = require('cors');
const postRoutes = require('./routes/postRoutes');
const usersRoutes = require('./routes/usersRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/posts', postRoutes);
app.use('/api/users', usersRoutes);
app.use('/uploads', express.static('uploads'));
// Em backend/index.js ou app.js, onde estão suas rotas:
  
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
