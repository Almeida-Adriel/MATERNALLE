const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

const usuariosRoutes = require('./routes/usuarios');

app.use(cors());
app.use(bodyParser.json());

app.use('/usuarios', usuariosRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
