const express = require("express");
const { getUsers, createUsers, updateUser, deleteUser, getByEmail, Login } = require("../controllers/usersController");
const authMiddleware  = require("../middlewares/auth");
const router = express.Router();

router.get('/get', authMiddleware, getUsers);
router.get('/getbyemail/:email', authMiddleware, getByEmail);
router.post('/login', Login);
router.post('/create', createUsers);
router.put('/update/:id', authMiddleware, updateUser);
router.delete('/delete/:id', authMiddleware, deleteUser );
module.exports = router;
