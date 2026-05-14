const comentarioService = require("../services/ComentarioService.js");
const { erroCatch } = require("../utils/errorJornal.js");

class ComentarioController {
  async listarComentarios(req, res) {
    try {
      const result = await comentarioService.listarComentarios();
      res.json(result);
    } catch (error) {
      erroCatch(req, res, error);
    }
  }

  async buscarComentario(req, res) {
    try {
      const result = await comentarioService.buscarComentario(req.params.id);
      res.json(result);
    } catch (error) {
      erroCatch(req, res, error);
    }
  }

  async cadastrarComentario(req, res) {
    try {
      const result = await comentarioService.cadastrarComentario(req.body);
      res.status(201).json(result);
    } catch (error) {
      erroCatch(req, res, error);
    }
  }

  async atualizarComentario(req, res) {
    try {
      const result = await comentarioService.atualizarComentario(req.body, req.params.id);
      res.json(result);
    } catch (error) {
      erroCatch(req, res, error);
    }
  }

  async deletarComentario(req, res) {
    try {
      const result = await comentarioService.deletarComentario(req.params.id);
      res.json(result);
    } catch (error) {
      erroCatch(req, res, error);
    }
  }
}

module.exports = new ComentarioController();
