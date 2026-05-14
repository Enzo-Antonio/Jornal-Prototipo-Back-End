const statusComentarioService = require("../services/StatusComentarioService.js");
const { erroCatch } = require("../utils/errorJornal.js");

class StatusComentarioController {
  async listarStatusComentario(req, res) {
    try {
      const result = await statusComentarioService.listarStatusComentario();
      res.json(result);
    } catch (error) {
      erroCatch(req, res, error);
    }
  }

  async buscarStatusComentario(req, res) {
    try {
      const result = await statusComentarioService.buscarStatusComentario(req.params.id);
      res.json(result);
    } catch (error) {
      erroCatch(req, res, error);
    }
  }

  async cadastrarStatusComentario(req, res) {
    try {
      const result = await statusComentarioService.cadastrarStatusComentario(req.body);
      res.status(201).json(result);
    } catch (error) {
      erroCatch(req, res, error);
    }
  }

  async atualizarStatusComentario(req, res) {
    try {
      const result = await statusComentarioService.atualizarStatusComentario(req.body, req.params.id);
      res.json(result);
    } catch (error) {
      erroCatch(req, res, error);
    }
  }

  async deletarStatusComentario(req, res) {
    try {
      const result = await statusComentarioService.deletarStatusComentario(req.params.id);
      res.json(result);
    } catch (error) {
      erroCatch(req, res, error);
    }
  }
}

module.exports = new StatusComentarioController();
