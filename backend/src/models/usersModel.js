const db = require("../config/db");
const bcrypt = require('bcrypt');

const getAllUsers = (callback) => {
  db.query("SELECT * FROM users", callback);
};

const getUserById = (id, callback) => {
  const sql = ("SELECT nome, email FROM users where id=?");
  db.query(sql, [id], callback);
}
const createUsers =  async (nome, email, senha, callback) => {
  const sql = "INSERT INTO users (nome, email, senha) VALUES (?, ?, ?)";
  const senha_hash = await bcrypt.hash(senha, 10);
  db.query(sql, [nome, email, senha_hash], callback);
};
const updateUser = (id, nome, email, senha, perfil, callback) => {
    const sql = 'UPDATE users SET nome=?, email=?, senha=?, perfil=? WHERE id=?';

    db.query(sql, [nome, email, senha, perfil, id], callback);
};
const deleteUser = (id, callback) => {
    const sql = "DELETE FROM users WHERE id=?";
    db.query(sql, [id], callback);
}
const getByEmail = (email, callback) => {
  const sql = "SELECT id, nome, email, senha FROM users WHERE email=?";

  db.query(sql, [email], (err, result) => {
    callback(err, result);
  });
}
module.exports = { getAllUsers, createUsers, updateUser, deleteUser, getByEmail, getUserById};
