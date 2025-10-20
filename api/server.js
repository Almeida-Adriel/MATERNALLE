import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

// Importar rotas
import authRoutes from './routes/auth.js';
import usuarios from './routes/usuarios.js';

const app = express();

const whitelist = ['https://site.com', 'http://localhost:5000', 'http://localhost:5173'];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/', usuarios);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));