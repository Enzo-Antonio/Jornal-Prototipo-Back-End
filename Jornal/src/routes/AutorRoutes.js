const express = require("express");
const router = express.Router();
const autorController = require("../controller/AutorController.js");

router.get("/", autorController.listarAutores);
router.get("/:id", autorController.buscarAutor);
router.post("/", autorController.cadastrarAutor);
router.put("/:id", autorController.atualizarAutor);
router.delete("/:id", autorController.deletarAutor);

module.exports = router;
