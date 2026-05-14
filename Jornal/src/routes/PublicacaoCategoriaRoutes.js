const express = require("express");
const router = express.Router();
const publicacaoCategoriaController = require("../controller/PublicacaoCategoriaController.js");

router.get("/", publicacaoCategoriaController.listarVinculos);
router.get("/:id", publicacaoCategoriaController.buscarVinculo);
router.post("/", publicacaoCategoriaController.cadastrarVinculo);
router.put("/:id", publicacaoCategoriaController.atualizarVinculo);
router.delete("/:id", publicacaoCategoriaController.deletarVinculo);

module.exports = router;
