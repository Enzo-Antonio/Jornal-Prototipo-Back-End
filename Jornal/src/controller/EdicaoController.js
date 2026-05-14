const edicaoService = require("../services/EdicaoService.js");
const { erroCatch } = require("../utils/errorJornal.js");

class EdicaoController {
  async listarEdicoes(req, res) {
    try {
      const result = await edicaoService.listarEdicoes();
      res.json(result);
    } catch (error) {
      erroCatch(req, res, error);
    }
  }

  async buscarEdicao(req, res) {
    try {
      const result = await edicaoService.buscarEdicao(req.params.id);
      res.json(result);
    } catch (error) {
      erroCatch(req, res, error);
    }
  }

  async cadastrarEdicao(req, res) {
    try {
      const result = await edicaoService.cadastrarEdicao(req.body);
      res.status(201).json(result);
    } catch (error) {
      erroCatch(req, res, error);
    }
  }

  async atualizarEdicao(req, res) {
    try {
      const result = await edicaoService.atualizarEdicao(req.body, req.params.id);
      res.json(result);
    } catch (error) {
      erroCatch(req, res, error);
    }
  }

  async deletarEdicao(req, res) {
    try {
      const result = await edicaoService.deletarEdicao(req.params.id);
      res.json(result);
    } catch (error) {
      erroCatch(req, res, error);
    }
  }
}

module.exports = new EdicaoController();
