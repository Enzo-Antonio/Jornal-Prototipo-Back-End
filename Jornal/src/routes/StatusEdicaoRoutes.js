const express = require("express");
const router = express.Router();
const statusEdicaoController = require("../controller/StatusEdicaoController.js");

router.get("/", statusEdicaoController.listarStatusEdicao);
router.get("/:id", statusEdicaoController.buscarStatusEdicao);
router.post("/", statusEdicaoController.cadastrarStatusEdicao);
router.put("/:id", statusEdicaoController.atualizarStatusEdicao);
router.delete("/:id", statusEdicaoController.deletarStatusEdicao);

module.exports = router;
