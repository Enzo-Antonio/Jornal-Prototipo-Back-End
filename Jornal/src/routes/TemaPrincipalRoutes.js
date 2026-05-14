const express = require("express");
const router = express.Router();
const temaPrincipalController = require("../controller/TemaPrincipalController.js");

router.get("/", temaPrincipalController.listarTemasPrincipais);
router.get("/:id", temaPrincipalController.buscarTemaPrincipal);
router.post("/", temaPrincipalController.cadastrarTemaPrincipal);
router.put("/:id", temaPrincipalController.atualizarTemaPrincipal);
router.delete("/:id", temaPrincipalController.deletarTemaPrincipal);

module.exports = router;
