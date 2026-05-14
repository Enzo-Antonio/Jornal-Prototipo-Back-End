const publicacaoCategoriaService = require("../services/PublicacaoCategoriaService.js");
const { erroCatch } = require("../utils/errorJornal.js");

class PublicacaoCategoriaController {
  async listarVinculos(req, res) {
    try {
      const result = await publicacaoCategoriaService.listarVinculos();
      res.json(result);
    } catch (error) {
      erroCatch(req, res, error);
    }
  }

  async buscarVinculo(req, res) {
    try {
      const result = await publicacaoCategoriaService.buscarVinculo(req.params.id);
      res.json(result);
    } catch (error) {
      erroCatch(req, res, error);
    }
  }

  async cadastrarVinculo(req, res) {
    try {
      const result = await publicacaoCategoriaService.cadastrarVinculo(req.body);
      res.status(201).json(result);
    } catch (error) {
      erroCatch(req, res, error);
    }
  }

  async atualizarVinculo(req, res) {
    try {
      const result = await publicacaoCategoriaService.atualizarVinculo(req.body, req.params.id);
      res.json(result);
    } catch (error) {
      erroCatch(req, res, error);
    }
  }

  async deletarVinculo(req, res) {
    try {
      const result = await publicacaoCategoriaService.deletarVinculo(req.params.id);
      res.json(result);
    } catch (error) {
      erroCatch(req, res, error);
    }
  }
}

module.exports = new PublicacaoCategoriaController();
