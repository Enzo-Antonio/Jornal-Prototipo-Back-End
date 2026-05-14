const express = require("express");
const router = express.Router();
const autorRoutes = require("./Autor.js");

router.use("/autores", autorRoutes);

module.exports = router;
