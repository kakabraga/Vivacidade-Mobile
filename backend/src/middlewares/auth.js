const jwt = require('jsonwebtoken');
const secret = '1234';

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Token inválido" });
    }

    req.user = decoded;
    next(); // passa pra rota
  });
};

module.exports = authMiddleware;
