const express = require("express");
const router = express.Router();
const publicacaoController = require("../controller/PublicacaoController.js");

router.get("/", publicacaoController.listarPublicacoes);
router.get("/:id", publicacaoController.buscarPublicacao);
router.post("/", publicacaoController.cadastrarPublicacao);
router.put("/:id", publicacaoController.atualizarPublicacao);
router.delete("/:id", publicacaoController.deletarPublicacao);

module.exports = router;
