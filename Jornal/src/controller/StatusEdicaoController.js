const statusEdicaoService = require("../services/StatusEdicaoService.js");
const { erroCatch } = require("../utils/errorJornal.js");

class StatusEdicaoController {
  async listarStatusEdicao(req, res) {
    try {
      const result = await statusEdicaoService.listarStatusEdicao();
      res.json(result);
    } catch (error) {
      erroCatch(req, res, error);
    }
  }

  async buscarStatusEdicao(req, res) {
    try {
      const result = await statusEdicaoService.buscarStatusEdicao(req.params.id);
      res.json(result);
    } catch (error) {
      erroCatch(req, res, error);
    }
  }

  async cadastrarStatusEdicao(req, res) {
    try {
      const result = await statusEdicaoService.cadastrarStatusEdicao(req.body);
      res.status(201).json(result);
    } catch (error) {
      erroCatch(req, res, error);
    }
  }

  async atualizarStatusEdicao(req, res) {
    try {
      const result = await statusEdicaoService.atualizarStatusEdicao(req.body, req.params.id);
      res.json(result);
    } catch (error) {
      erroCatch(req, res, error);
    }
  }

  async deletarStatusEdicao(req, res) {
    try {
      const result = await statusEdicaoService.deletarStatusEdicao(req.params.id);
      res.json(result);
    } catch (error) {
      erroCatch(req, res, error);
    }
  }
}

module.exports = new StatusEdicaoController();
