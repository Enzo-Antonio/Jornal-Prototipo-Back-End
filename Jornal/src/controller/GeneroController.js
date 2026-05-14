const generoService = require("../services/GeneroService.js");
const { erroCatch } = require("../utils/errorJornal.js");

class GeneroController {
  async listarGeneros(req, res) {
    try {
      const result = await generoService.listarGeneros();
      res.json(result);
    } catch (error) {
      erroCatch(req, res, error);
    }
  }

  async buscarGenero(req, res) {
    try {
      const result = await generoService.buscarGenero(req.params.id);
      res.json(result);
    } catch (error) {
      erroCatch(req, res, error);
    }
  }

  async cadastrarGenero(req, res) {
    try {
      const result = await generoService.cadastrarGenero(req.body);
      res.status(201).json(result);
    } catch (error) {
      erroCatch(req, res, error);
    }
  }

  async atualizarGenero(req, res) {
    try {
      const result = await generoService.atualizarGenero(req.body, req.params.id);
      res.json(result);
    } catch (error) {
      erroCatch(req, res, error);
    }
  }

  async deletarGenero(req, res) {
    try {
      const result = await generoService.deletarGenero(req.params.id);
      res.json(result);
    } catch (error) {
      erroCatch(req, res, error);
    }
  }
}

module.exports = new GeneroController();
