const publicacaoService = require("../services/PublicacaoService.js");
const { erroCatch } = require("../utils/errorJornal.js");

class PublicacaoController {
  async listarPublicacoes(req, res) {
    try {
      const result = await publicacaoService.listarPublicacoes();
      res.json(result);
    } catch (error) {
      erroCatch(req, res, error);
    }
  }

  async buscarPublicacao(req, res) {
    try {
      const result = await publicacaoService.buscarPublicacao(req.params.id);
      res.json(result);
    } catch (error) {
      erroCatch(req, res, error);
    }
  }

  async cadastrarPublicacao(req, res) {
    try {
      const result = await publicacaoService.cadastrarPublicacao(req.body);
      res.status(201).json(result);
    } catch (error) {
      erroCatch(req, res, error);
    }
  }

  async atualizarPublicacao(req, res) {
    try {
      const result = await publicacaoService.atualizarPublicacao(req.body, req.params.id);
      res.json(result);
    } catch (error) {
      erroCatch(req, res, error);
    }
  }

  async deletarPublicacao(req, res) {
    try {
      const result = await publicacaoService.deletarPublicacao(req.params.id);
      res.json(result);
    } catch (error) {
      erroCatch(req, res, error);
    }
  }
}

module.exports = new PublicacaoController();
