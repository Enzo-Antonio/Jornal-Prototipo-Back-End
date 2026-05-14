const express = require("express");
const router = express.Router();
const statusComentarioController = require("../controller/StatusComentarioController.js");

router.get("/", statusComentarioController.listarStatusComentario);
router.get("/:id", statusComentarioController.buscarStatusComentario);
router.post("/", statusComentarioController.cadastrarStatusComentario);
router.put("/:id", statusComentarioController.atualizarStatusComentario);
router.delete("/:id", statusComentarioController.deletarStatusComentario);

module.exports = router;
