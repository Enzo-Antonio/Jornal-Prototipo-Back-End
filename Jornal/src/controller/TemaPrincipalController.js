const temaPrincipalService = require("../services/TemaPrincipalService.js");
const { erroCatch } = require("../utils/errorJornal.js");

class TemaPrincipalController {
  async listarTemasPrincipais(req, res) {
    try {
      const result = await temaPrincipalService.listarTemasPrincipais();
      res.json(result);
    } catch (error) {
      erroCatch(req, res, error);
    }
  }

  async buscarTemaPrincipal(req, res) {
    try {
      const result = await temaPrincipalService.buscarTemaPrincipal(req.params.id);
      res.json(result);
    } catch (error) {
      erroCatch(req, res, error);
    }
  }

  async cadastrarTemaPrincipal(req, res) {
    try {
      const result = await temaPrincipalService.cadastrarTemaPrincipal(req.body);
      res.status(201).json(result);
    } catch (error) {
      erroCatch(req, res, error);
    }
  }

  async atualizarTemaPrincipal(req, res) {
    try {
      const result = await temaPrincipalService.atualizarTemaPrincipal(req.body, req.params.id);
      res.json(result);
    } catch (error) {
      erroCatch(req, res, error);
    }
  }

  async deletarTemaPrincipal(req, res) {
    try {
      const result = await temaPrincipalService.deletarTemaPrincipal(req.params.id);
      res.json(result);
    } catch (error) {
      erroCatch(req, res, error);
    }
  }
}

module.exports = new TemaPrincipalController();
