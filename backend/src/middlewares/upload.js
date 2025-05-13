const multer = require('multer');
const path = require('path');

// Configurando onde as imagens vão ser salvas
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // pasta onde salvará os arquivos
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname); // pega extensão do arquivo
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Configurando filtro de tipos permitidos (opcional, mas legal de ter)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'video/mp4'];
 
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo não suportado'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
});

module.exports = upload;
