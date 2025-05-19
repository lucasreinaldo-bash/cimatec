const express = require('express');
const { expressjwt: jwt } = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');

const app = express();
app.use(express.json());

// Chave secreta para assinatura – em produção, use variável de ambiente
const SECRET_KEY = process.env.SECRET_KEY || 'edu_learn_secret';

// Endpoint público para emissão de token
// Depois de executar o comando npm install e o comando npm start, acesse localhost:3000/token para receber o seu JWT que sera utilizado para conseguir acessar o endpoint de user
app.get('/token', (req, res) => {
  const user = req.query.user || 'guest';
  const role = req.query.role || 'student';
  const payload = { sub: user, role };
  const token = jsonwebtoken.sign(payload, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
});

// Rota protegida: lista de usuários
app.get('/users', (req, res) => {
  res.json([
    { id:1, name:'Alice Silva', role:'professora', email:'alice@edulearn.com', dateOfBirth:'12/04/1998', cpf:'12345678901', department:'Ciência da Computação', salary:'R$ 4.500,00' },
    { id:2, name:'Lucas Reinaldo', role:'professor', email:'lucas@edulearn.com', dateOfBirth:'23/11/1985', cpf:'98765432100', department:'Matemática', salary:'R$ 6.200,00' },
    { id:3, name:'Carla Oliveira', role:'professora', email:'carla@edulearn.com', dateOfBirth:'30/07/2000', cpf:'13579246800', department:'Química', salary:'R$ 5.000,00' }
  
  ]);
});

// Tratamento de erros de autenticação JWT
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: 'Token inválido ou ausente' });
  }
  next(err);
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`EduLearn User Service rodando na porta ${PORT}`));
