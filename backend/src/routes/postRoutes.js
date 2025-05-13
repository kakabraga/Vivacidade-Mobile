const express = require('express');
const { getPosts, createPost, updatePost, deletePost, listaPostPorId, getLastPosts, getPostsPorUser, createComennt,
    getCommentsPorPost
 } = require('../controllers/postController');
const authMiddleware  = require("../middlewares/auth");
const upload = require('../middlewares/upload'); 
const video = require('../middlewares/upload_video'); 
const router = express.Router();

router.get('/get', getPosts);          // Listar posts
router.post('/create', authMiddleware, upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 },
  ]), createPost);    // Criar post
router.post('/addcomments/:id_post', createComennt);
router.put('/update/:id', updatePost); // Atualizar post
router.delete('/delete/:id', deletePost); // Deletar post
router.get('/getid/:id', listaPostPorId); // Obter post por ID
router.get('/getLastPosts', getLastPosts); // Obter post por ID
router.get('/getpostsporuser/:id', getPostsPorUser);
router.get('/getComments/:id_post', getCommentsPorPost);
module.exports = router;
