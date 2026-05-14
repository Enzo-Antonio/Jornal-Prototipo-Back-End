const categoriaService = require("../services/CategoriaService.js");
const { erroCatch } = require("../utils/errorJornal.js");

class CategoriaController {
  async listarCategorias(req, res) {
    try {
      const result = await categoriaService.listarCategorias();
      res.json(result);
    } catch (error) {
      erroCatch(req, res, error);
    }
  }

  async buscarCategoria(req, res) {
    try {
      const result = await categoriaService.buscarCategoria(req.params.id);
      res.json(result);
    } catch (error) {
      erroCatch(req, res, error);
    }
  }

  async cadastrarCategoria(req, res) {
    try {
      const result = await categoriaService.cadastrarCategoria(req.body);
      res.status(201).json(result);
    } catch (error) {
      erroCatch(req, res, error);
    }
  }

  async atualizarCategoria(req, res) {
    try {
      const result = await categoriaService.atualizarCategoria(req.body, req.params.id);
      res.json(result);
    } catch (error) {
      erroCatch(req, res, error);
    }
  }

  async deletarCategoria(req, res) {
    try {
      const result = await categoriaService.deletarCategoria(req.params.id);
      res.json(result);
    } catch (error) {
      erroCatch(req, res, error);
    }
  }
}

module.exports = new CategoriaController();
