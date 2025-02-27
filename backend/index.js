const express = require('express');
const app = express();
const http = require('http');
const mongoose = require('mongoose');
const config = require('./config');
const router = require("./router");
const port = 9000;
require('dotenv').config();

// Conexão com a base de dados (MongoDB) 
mongoose
  .connect(config.db)
  .then(() => { console.log("Conexão com o banco de dados bem-sucedida!"); })
  .catch((err) => {
    console.error("Erro de conexão com o banco de dados:", err);
    process.exit(1); // Encerra o processo se não conseguir conectar ao banco
  });

const server = http.createServer(app);

app.use(router.init());

// Iniciando o servidor
server.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

module.exports = app;