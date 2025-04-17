const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjcsImVtYWlsIjoiY2F1ZXppbkBvdXRsb29rLmNvbSIsIm5vbWUiOiJUZXN0ZSIsImlhdCI6MTc0NDgzNTg4NiwiZXhwIjoxNzQ0ODM5NDg2fQ.nPif4qVd5EKMAxbkCM6cW3NUGJJ7V-Na4B5X_D13hmw';
try {
  const decoded = jwt_decode(testToken);
  console.log('Decodificado:', decoded);
} catch (error) {
  console.error('Erro ao decodificar token:', error);
}