const Post = require('../models/postModel');

// Listar posts
const getPosts = (req, res) => {
    Post.getAllPosts((err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao buscar posts' });
        }
        res.json(results);
    });
};

const createPost = (req, res) => {
  // Desestruturando os dados do corpo da requisição
  const { title, content } = req.body;
  const userId = req.user.id;   
  // Verificando se o título e conteúdo foram fornecidos
  if (!title) {
    return res.status(400).json({ error: 'Título é obrigatório' });
  }
  if (!content) {
    return res.status(400).json({ error: 'Conteúdo é obrigatório' });
  }

  // Verificando se o usuário está autenticado e se o id do usuário está presente
//   const userId = req.user && req.user.id;  // O id do usuário autenticado

  if (!userId) {
    return res.status(401).json({ error: 'Usuário não autenticado' });
  }

  // Criação do post no banco de dados
  Post.createPost(title, content, userId, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao criar post', err });
    }

    // Retorno de sucesso
    res.status(201).json({ message: 'Post criado com sucesso!' });
  });
};

module.exports = { createPost };

// Atualizar post
const updatePost = (req, res) => {
    const { id } = req.params;
    const { title, content, image } = req.body;

    Post.updatePost(id, title, content, image, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao atualizar post' });
        }
        res.json({ message: 'Post atualizado com sucesso!' });
    });
};

// Deletar post
const deletePost = (req, res) => {
    const { id } = req.params;

    Post.deletePost(id, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao deletar post' });
        }
        res.json({ message: 'Post deletado com sucesso!' });
    });
};

const listaPostPorId = (req, res) => {
    const {id} = req.params;
    Post.getPorId(id, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao buscar post' });
        }
        if (result.length === 0) {  // Verifica se o post foi encontrado
            return res.status(404).json({ message: 'Post não encontrado' });
        }

        res.json({ post: result });
    });
}


module.exports = { getPosts, createPost, updatePost, deletePost, listaPostPorId };
