const generoRepository = require("../repositories/GeneroRepository.js");
const { criarErro } = require("../utils/errorJornal.js");

function validarNumero(id) {
  return id && !isNaN(id) && Number(id) > 0;
}

class GeneroService {
  async listarGeneros() {
    try {
      const generos = await generoRepository.listarGeneros();
      return { sucesso: true, dados: generos, total: generos.length };
    } catch (error) { throw error; }
  }

  async buscarGenero(id) {
    try {
      if (!validarNumero(id)) throw criarErro("ID inválido", 400);
      const genero = await generoRepository.buscarGenero(id);
      if (!genero) throw criarErro("Gênero não encontrado", 404);
      return { sucesso: true, dados: genero };
    } catch (error) { throw error; }
  }

  async cadastrarGenero(dados) {
    try {
      const { nome, descricao } = dados;
      if (!nome) throw criarErro("Nome é obrigatório", 400);
      const novo = {
        nome: nome.trim(),
        descricao: descricao != null ? String(descricao).trim() : null,
      };
      const id = await generoRepository.cadastrarGenero(novo);
      return { sucesso: true, mensagem: "Gênero cadastrado com sucesso!", id };
    } catch (error) { throw error; }
  }

  async atualizarGenero(dados, id) {
    try {
      if (!validarNumero(id)) throw criarErro("ID inválido", 400);
      const existente = await generoRepository.buscarGenero(id);
      if (!existente) throw criarErro("Gênero não encontrado", 404);
      const atualizado = {};
      if (dados.nome) atualizado.nome = dados.nome.trim();
      if (dados.descricao !== undefined) atualizado.descricao = dados.descricao;
      if (Object.keys(atualizado).length === 0) throw criarErro("Nenhuma alteração fornecida", 400);
      await generoRepository.atualizarGenero(atualizado, id);
      return { sucesso: true, mensagem: "Gênero atualizado com sucesso!" };
    } catch (error) { throw error; }
  }

  async deletarGenero(id) {
    try {
      if (!validarNumero(id)) throw criarErro("ID inválido", 400);
      const existente = await generoRepository.buscarGenero(id);
      if (!existente) throw criarErro("Gênero não encontrado", 404);
      await generoRepository.deletarGenero(id);
      return { sucesso: true, mensagem: "Gênero deletado com sucesso!" };
    } catch (error) { throw error; }
  }
}

module.exports = new GeneroService();
