const db = require('../config/db');

// Buscar todos os posts
const getAllPosts = (callback) => {
    db.query('SELECT * FROM posts', callback);
};
const getPorId = (id, callback) => {
    const sql = 'SELECT * FROM posts WHERE id= ?';
    db.query(sql, [id], (err, result) => {
        callback(err, result);
    });
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
}
module.exports = { getAllPosts, createPost, updatePost, deletePost, getPorId, getLastPosts, getPostsPorUser };
