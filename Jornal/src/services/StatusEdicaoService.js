const statusEdicaoRepository = require("../repositories/StatusEdicaoRepository.js");
const { criarErro } = require("../utils/errorJornal.js");

function validarNumero(id) {
  return id && !isNaN(id) && Number(id) > 0;
}

class StatusEdicaoService {
  async listarStatusEdicao() {
    try {
      const itens = await statusEdicaoRepository.listarStatusEdicao();
      return { sucesso: true, dados: itens, total: itens.length };
    } catch (error) { throw error; }
  }

  async buscarStatusEdicao(id) {
    try {
      if (!validarNumero(id)) throw criarErro("ID inválido", 400);
      const item = await statusEdicaoRepository.buscarStatusEdicao(id);
      if (!item) throw criarErro("Status de edição não encontrado", 404);
      return { sucesso: true, dados: item };
    } catch (error) { throw error; }
  }

  async cadastrarStatusEdicao(dados) {
    try {
      const { nome } = dados;
      if (!nome) throw criarErro("Nome é obrigatório", 400);
      const id = await statusEdicaoRepository.cadastrarStatusEdicao({ nome: nome.trim() });
      return { sucesso: true, mensagem: "Status de edição cadastrado com sucesso!", id };
    } catch (error) { throw error; }
  }

  async atualizarStatusEdicao(dados, id) {
    try {
      if (!validarNumero(id)) throw criarErro("ID inválido", 400);
      const existente = await statusEdicaoRepository.buscarStatusEdicao(id);
      if (!existente) throw criarErro("Status de edição não encontrado", 404);
      if (!dados.nome) throw criarErro("Nenhuma alteração fornecida", 400);
      await statusEdicaoRepository.atualizarStatusEdicao({ nome: dados.nome.trim() }, id);
      return { sucesso: true, mensagem: "Status de edição atualizado com sucesso!" };
    } catch (error) { throw error; }
  }

  async deletarStatusEdicao(id) {
    try {
      if (!validarNumero(id)) throw criarErro("ID inválido", 400);
      const existente = await statusEdicaoRepository.buscarStatusEdicao(id);
      if (!existente) throw criarErro("Status de edição não encontrado", 404);
      await statusEdicaoRepository.deletarStatusEdicao(id);
      return { sucesso: true, mensagem: "Status de edição deletado com sucesso!" };
    } catch (error) { throw error; }
  }
}

module.exports = new StatusEdicaoService();
