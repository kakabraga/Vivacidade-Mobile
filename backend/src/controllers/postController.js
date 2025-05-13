const Post = require("../models/postModel");

// Listar posts
const getPosts = (req, res) => {
  Post.getAllPosts((err, results) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao buscar posts" });
    }
    res.json(results);
  });
};

const getLastPosts = (req, res) => {
  Post.getLastPosts((err, results) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao buscar posts" });
    }
    res.json(results);
  });
};
const createPost = (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.id;
const image = req.files?.image?.[0]?.path || "uploads/image.png";
const video = req.files?.video?.[0]?.path || null;
  // Validações
  if (!title) {
    return res.status(400).json({ error: "Título é obrigatório" });
  }
  if (!content) {
    return res.status(400).json({ error: "Conteúdo é obrigatório" });
  }
  if (!userId) {
    return res.status(401).json({ error: "Usuário não autenticado" });
  }
  // Criação do post no banco de dados, agora enviando também a imagem
  Post.createPost(title, content, userId, image, video, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao criar post", err });
    }

    res.status(201).json({ message: "Post criado com sucesso!" });
  });
};

// Atualizar post
const updatePost = (req, res) => {
  const { id } = req.params;
  const { title, content, image } = req.body;

  Post.updatePost(id, title, content, image, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao atualizar post" });
    }
    res.json({ message: "Post atualizado com sucesso!" });
  });
};

// Deletar post
const deletePost = (req, res) => {
  const { id } = req.params;

  Post.deletePost(id, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao deletar post" });
    }
    res.json({ message: "Post deletado com sucesso!" });
  });
};

const listaPostPorId = (req, res) => {
  const { id } = req.params;
  Post.getPorId(id, (err, post) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao buscar post" });
    }
    if (!post) {
      return res.status(404).json({ message: "Post não encontrado" });
    }

    res.json(post); // retorna o post diretamente como objeto
  });
};

const getPostsPorUser = (req, res) => {
  const { id } = req.params;
  Post.getPostsPorUser(id, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao buscar post" });
    }
    res.json(results)
  });
};
const createComennt = (req, res) => {
  const { id_post } = req.params;
  const { id_user, content } = req.body;

  if (!id_user || !id_post || !content) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  Post.AddComennt(id_user, id_post, content, (err, resultado) => {
    if (err) {
      console.error("Erro ao adicionar comentário:", err);
      return res.status(500).json({ error: "Erro ao adicionar comentário." });
    }

    res
      .status(201)
      .json({
        message: "Comentário adicionado com sucesso!",
        id: resultado.insertId,
      });
  });
};

const getCommentsPorPost = (req, res) => {
  const { id_post } = req.params;

  // Chama a função do model para buscar os comentários
  Post.getCommentsPorPost(id_post, (err, results) => {
    if (err) {
      // Se ocorrer erro na consulta
      return res.status(500).json({ error: "Erro ao buscar comentários." });
    }

    // Se não houver resultados, retorna array vazio (é melhor que erro)
    if (!results || results.length === 0) {
      return res.status(200).json([]); // Evita erro e permite controle no front-end
    }

    // Se encontrar, envia os comentários
    res.json(results);
  });
};

module.exports = {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  listaPostPorId,
  getLastPosts,
  getPostsPorUser,
  createComennt,
  getCommentsPorPost,
};
