const temaPrincipalRepository = require("../repositories/TemaPrincipalRepository.js");
const { criarErro } = require("../utils/errorJornal.js");

function validarNumero(id) {
  return id && !isNaN(id) && Number(id) > 0;
}

class TemaPrincipalService {
  async listarTemasPrincipais() {
    try {
      const itens = await temaPrincipalRepository.listarTemasPrincipais();
      return { sucesso: true, dados: itens, total: itens.length };
    } catch (error) { throw error; }
  }

  async buscarTemaPrincipal(id) {
    try {
      if (!validarNumero(id)) throw criarErro("ID inválido", 400);
      const item = await temaPrincipalRepository.buscarTemaPrincipal(id);
      if (!item) throw criarErro("Tema principal não encontrado", 404);
      return { sucesso: true, dados: item };
    } catch (error) { throw error; }
  }

  async cadastrarTemaPrincipal(dados) {
    try {
      const { nome, descricao } = dados;
      if (!nome) throw criarErro("Nome é obrigatório", 400);
      const novo = {
        nome: nome.trim(),
        descricao: descricao != null ? String(descricao).trim() : null,
      };
      const id = await temaPrincipalRepository.cadastrarTemaPrincipal(novo);
      return { sucesso: true, mensagem: "Tema principal cadastrado com sucesso!", id };
    } catch (error) { throw error; }
  }

  async atualizarTemaPrincipal(dados, id) {
    try {
      if (!validarNumero(id)) throw criarErro("ID inválido", 400);
      const existente = await temaPrincipalRepository.buscarTemaPrincipal(id);
      if (!existente) throw criarErro("Tema principal não encontrado", 404);
      const atualizado = {};
      if (dados.nome) atualizado.nome = dados.nome.trim();
      if (dados.descricao !== undefined) atualizado.descricao = dados.descricao;
      if (Object.keys(atualizado).length === 0) throw criarErro("Nenhuma alteração fornecida", 400);
      await temaPrincipalRepository.atualizarTemaPrincipal(atualizado, id);
      return { sucesso: true, mensagem: "Tema principal atualizado com sucesso!" };
    } catch (error) { throw error; }
  }

  async deletarTemaPrincipal(id) {
    try {
      if (!validarNumero(id)) throw criarErro("ID inválido", 400);
      const existente = await temaPrincipalRepository.buscarTemaPrincipal(id);
      if (!existente) throw criarErro("Tema principal não encontrado", 404);
      await temaPrincipalRepository.deletarTemaPrincipal(id);
      return { sucesso: true, mensagem: "Tema principal deletado com sucesso!" };
    } catch (error) { throw error; }
  }
}

module.exports = new TemaPrincipalService();
