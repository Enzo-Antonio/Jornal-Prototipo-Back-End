const statusComentarioRepository = require("../repositories/StatusComentarioRepository.js");
const { criarErro } = require("../utils/errorJornal.js");

function validarNumero(id) {
  return id && !isNaN(id) && Number(id) > 0;
}

class StatusComentarioService {
  async listarStatusComentario() {
    try {
      const itens = await statusComentarioRepository.listarStatusComentario();
      return {
        sucesso: true,
        dados: itens,
        total: itens.length,
      };
    } catch (error) {
      throw error;
    }
  }

  async buscarStatusComentario(id) {
    try {
      if (!validarNumero(id)) {
        throw criarErro("ID inválido", 400);
      }
      const item = await statusComentarioRepository.buscarStatusComentario(id);
      if (!item) {
        throw criarErro("Status de comentário não encontrado", 404);
      }
      return {
        sucesso: true,
        dados: item,
      };
    } catch (error) {
      throw error;
    }
  }

  async cadastrarStatusComentario(dados) {
    try {
      const { nome } = dados;
      if (!nome) {
        throw criarErro("Nome é obrigatório", 400);
      }
      const id = await statusComentarioRepository.cadastrarStatusComentario({ nome: nome.trim() });
      return {
        sucesso: true,
        mensagem: "Status de comentário cadastrado com sucesso!",
        id,
      };
    } catch (error) {
      throw error;
    }
  }

  async atualizarStatusComentario(dados, id) {
    try {
      if (!validarNumero(id)) {
        throw criarErro("ID inválido", 400);
      }
      const existente = await statusComentarioRepository.buscarStatusComentario(id);
      if (!existente) {
        throw criarErro("Status de comentário não encontrado", 404);
      }
      if (!dados.nome) {
        throw criarErro("Nenhuma alteração fornecida", 400);
      }
      await statusComentarioRepository.atualizarStatusComentario({ nome: dados.nome.trim() }, id);
      return {
        sucesso: true,
        mensagem: "Status de comentário atualizado com sucesso!",
      };
    } catch (error) {
      throw error;
    }
  }

  async deletarStatusComentario(id) {
    try {
      if (!validarNumero(id)) {
        throw criarErro("ID inválido", 400);
      }
      const existente = await statusComentarioRepository.buscarStatusComentario(id);
      if (!existente) {
        throw criarErro("Status de comentário não encontrado", 404);
      }
      await statusComentarioRepository.deletarStatusComentario(id);
      return {
        sucesso: true,
        mensagem: "Status de comentário deletado com sucesso!",
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new StatusComentarioService();
