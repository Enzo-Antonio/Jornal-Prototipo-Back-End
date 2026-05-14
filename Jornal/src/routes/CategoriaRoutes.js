const express = require("express");
const router = express.Router();
const categoriaController = require("../controller/CategoriaController.js");

router.get("/", categoriaController.listarCategorias);
router.get("/:id", categoriaController.buscarCategoria);
router.post("/", categoriaController.cadastrarCategoria);
router.put("/:id", categoriaController.atualizarCategoria);
router.delete("/:id", categoriaController.deletarCategoria);

module.exports = router;
