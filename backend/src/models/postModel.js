const db = require('../config/db');

// Buscar todos os posts
const getAllPosts = (callback) => {
    db.query('SELECT * FROM posts', callback);
};
const getPorId = (id, callback) => {
    const sql = 'SELECT * FROM posts WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            callback(err, null);
        } else if (result.length === 0) {
            callback(null, null); // nenhum post encontrado
        } else {
            callback(null, result[0]); // retorna só o objeto
        }
    });
};

const AddComennt = ( id_user, id_post, content , callback) => {
    const sql = 'INSERT INTO comments (id_user, id_post, content) VALUES (?, ?, ?)';
    db.query(sql, [id_user, id_post, content], callback);
  };

 const getPostsPorUser = (id, callback) => {
    const sql = "SELECT * FROM posts WHERE userId= ?"; 
    db.query(sql, [id], (err, result) => {
        callback(err, result);
    });
 }
// Criar um post
const createPost = (title, content, userId, imagePath, video, callback) => {
    const sql = 'INSERT INTO posts (title, content, userId, image, video) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [title, content, userId, imagePath, video], callback);
};

// Atualizar um post
const updatePost = (id, title, content, image, callback) => {
    const sql = 'UPDATE posts SET title = ?, content = ?, image = ? WHERE id = ?';
    db.query(sql, [title, content, image, id], callback);
};

// Deletar um post
const deletePost = (id, callback) => {
    const sql = 'DELETE FROM posts WHERE id = ?';
    db.query(sql, [id], callback);
};

const getLastPosts = (callback) => {
    const sql = 'SELECT * FROM posts ORDER BY ID DESC LIMIT 8';
    db.query(sql, callback);
};

const getCommentsPorPost = (id_post, callback) => {
    const sql = 'SELECT u.nome, u.id as userId, c.id_user, c.id_post, c.content, c.comment_at, c.id FROM users as u, comments as c WHERE c.id_user = u.id AND c.id_post = ? ORDER BY c.id DESC';
    db.query(sql, [id_post], (err, result) => {
        callback(err, result);
    });
};


module.exports = { getAllPosts, createPost, updatePost, deletePost, getPorId, getLastPosts, getPostsPorUser, AddComennt, getCommentsPorPost};
