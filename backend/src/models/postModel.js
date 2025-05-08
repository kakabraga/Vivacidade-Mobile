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
const createPost = (title, content, userId, imagePath, callback) => {
    const sql = 'INSERT INTO posts (title, content, userId, image) VALUES (?, ?, ?, ?)';
    db.query(sql, [title, content, userId, imagePath], callback);
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
    const sql = 'SELECT u.nome, u.id as user_id, c.content, c.comment_at, c.id_post, p.id FROM users as u, comments as c, posts as p  WHERE c.id_post = p.id AND p.id = ?';
    db.query(sql, [id_post], (err, result) => {
        callback(err, result);
    });
};


module.exports = { getAllPosts, createPost, updatePost, deletePost, getPorId, getLastPosts, getPostsPorUser, AddComennt, getCommentsPorPost};
