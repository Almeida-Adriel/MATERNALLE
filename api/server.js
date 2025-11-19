import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

// Importar rotas
import authRoutes from './routes/auth.js';
import usuarios from './routes/usuarios.js';
import esqueciMinhaSenha from './routes/esqueci_minha_senha.js';
import notasRoutes from './routes/notas.js';
import conteudosRoutes from './routes/conteudos.js';

const app = express();

app.set('trust proxy', 1)
app.use(cookieParser());

const whitelist = ['https://maternalle.com.br', 'https://almeida-adriel.github.io', 'http://192.168.1.17:5173', 'http://localhost:5174'];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/', usuarios);
app.use('/', esqueciMinhaSenha)
app.use('/notas', notasRoutes);
app.use('/conteudos', conteudosRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));