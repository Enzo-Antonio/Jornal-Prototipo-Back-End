const autorService = require("../services/AutorService.js");
const { erroCatch } = require("../utils/errorJornal.js");

class AutorController {
  async listarAutores(req, res) {
    try {
      const result = await autorService.listarAutores();
      res.json(result);
    } catch (error) {
      erroCatch(req, res, error);
    }
  }

  async buscarAutor(req, res) {
    try {
      const result = await autorService.buscarAutor(req.params.id);
      res.json(result);
    } catch (error) {
      erroCatch(req, res, error);
    }
  }

  async cadastrarAutor(req, res) {
    try {
      const result = await autorService.cadastrarAutor(req.body);
      res.status(201).json(result);
    } catch (error) {
      erroCatch(req, res, error);
    }
  }

  async atualizarAutor(req, res) {
    try {
      const result = await autorService.atualizarAutor(req.body, req.params.id);
      res.json(result);
    } catch (error) {
      erroCatch(req, res, error);
    }
  }

  async deletarAutor(req, res) {
    try {
      const result = await autorService.deletarAutor(req.params.id);
      res.json(result);
    } catch (error) {
      erroCatch(req, res, error);
    }
  }
}

module.exports = new AutorController();
