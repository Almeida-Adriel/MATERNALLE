import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

// Importar rotas
import usuariosRoutes from './routes/usuarios.js';

const app = express();

const whitelist = ['https://site.com', 'http://localhost:5000'];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use('/usuarios', usuariosRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));