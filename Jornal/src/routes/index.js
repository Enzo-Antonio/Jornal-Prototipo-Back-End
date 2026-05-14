const express = require("express");
const router = express.Router();
const autorRoutes = require("./AutorRoutes.js");
const generoRoutes = require("./GeneroRoutes.js");
const temaPrincipalRoutes = require("./TemaPrincipalRoutes.js");
const categoriaRoutes = require("./CategoriaRoutes.js");
const statusEdicaoRoutes = require("./StatusEdicaoRoutes.js");
const statusComentarioRoutes = require("./StatusComentarioRoutes.js");
const edicaoRoutes = require("./EdicaoRoutes.js");
const publicacaoRoutes = require("./PublicacaoRoutes.js");
const comentarioRoutes = require("./ComentarioRoutes.js");
const publicacaoCategoriaRoutes = require("./PublicacaoCategoriaRoutes.js");

router.use("/autores", autorRoutes);
router.use("/generos", generoRoutes);
router.use("/temas-principais", temaPrincipalRoutes);
router.use("/categorias", categoriaRoutes);
router.use("/status-edicao", statusEdicaoRoutes);
router.use("/status-comentario", statusComentarioRoutes);
router.use("/edicoes", edicaoRoutes);
router.use("/publicacoes", publicacaoRoutes);
router.use("/comentarios", comentarioRoutes);
router.use("/publicacoes-categorias", publicacaoCategoriaRoutes);

module.exports = router;
