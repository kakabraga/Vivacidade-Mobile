const express = require('express');
const { getPosts, createPost, updatePost, deletePost, listaPostPorId, getLastPosts, getPostsPorUser } = require('../controllers/postController');
const authMiddleware  = require("../middlewares/auth");
const upload = require('../middlewares/upload'); 
const router = express.Router();

router.get('/get', getPosts);          // Listar posts
router.post('/create', authMiddleware, upload.single('image'), createPost);    // Criar post
router.put('/update/:id', updatePost); // Atualizar post
router.delete('/delete/:id', deletePost); // Deletar post
router.get('/getid/:id', listaPostPorId); // Obter post por ID
router.get('/getLastPosts', getLastPosts); // Obter post por ID
router.get('/getPostsPorUser/:id', getPostsPorUser);
module.exports = router;
