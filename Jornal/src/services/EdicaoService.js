const edicaoRepository = require("../repositories/EdicaoRepository.js");
const { criarErro } = require("../utils/errorJornal.js");

function validarNumero(id) {
  return id && !isNaN(id) && Number(id) > 0;
}

class EdicaoService {
  async listarEdicoes() {
    try {
      const edicoes = await edicaoRepository.listarEdicoes();
      return {
        sucesso: true,
        dados: edicoes,
        total: edicoes.length,
      };
    } catch (error) {
      throw error;
    }
  }

  async buscarEdicao(id) {
    try {
      if (!validarNumero(id)) {
        throw criarErro("ID inválido", 400);
      }
      const edicao = await edicaoRepository.buscarEdicao(id);
      if (!edicao) {
        throw criarErro("Edição não encontrada", 404);
      }
      return {
        sucesso: true,
        dados: edicao,
      };
    } catch (error) {
      throw error;
    }
  }

  async cadastrarEdicao(dados) {
    try {
      const { numero, titulo, data_lancamento, status_id } = dados;
      if (numero === undefined || numero === null || !titulo || !data_lancamento || !status_id) {
        throw criarErro("Número, título, data de lançamento e status são obrigatórios", 400);
      }
      const novo = {
        numero: Number(numero),
        titulo: titulo.trim(),
        data_lancamento,
        status_id: Number(status_id),
        editorial: dados.editorial != null ? dados.editorial : null,
        capa_imagem: dados.capa_imagem != null ? String(dados.capa_imagem).trim() : null,
      };
      const id = await edicaoRepository.cadastrarEdicao(novo);
      return {
        sucesso: true,
        mensagem: "Edição cadastrada com sucesso!",
        id,
      };
    } catch (error) {
      throw error;
    }
  }

  async atualizarEdicao(dados, id) {
    try {
      if (!validarNumero(id)) {
        throw criarErro("ID inválido", 400);
      }
      const existente = await edicaoRepository.buscarEdicao(id);
      if (!existente) {
        throw criarErro("Edição não encontrada", 404);
      }
      const atualizado = {};
      if (dados.numero !== undefined) atualizado.numero = Number(dados.numero);
      if (dados.titulo) atualizado.titulo = dados.titulo.trim();
      if (dados.data_lancamento) atualizado.data_lancamento = dados.data_lancamento;
      if (dados.status_id !== undefined) atualizado.status_id = Number(dados.status_id);
      if (dados.editorial !== undefined) atualizado.editorial = dados.editorial;
      if (dados.capa_imagem !== undefined) atualizado.capa_imagem = dados.capa_imagem;
      if (Object.keys(atualizado).length === 0) {
        throw criarErro("Nenhuma alteração fornecida", 400);
      }
      await edicaoRepository.atualizarEdicao(atualizado, id);
      return {
        sucesso: true,
        mensagem: "Edição atualizada com sucesso!",
      };
    } catch (error) {
      throw error;
    }
  }

  async deletarEdicao(id) {
    try {
      if (!validarNumero(id)) {
        throw criarErro("ID inválido", 400);
      }
      const existente = await edicaoRepository.buscarEdicao(id);
      if (!existente) {
        throw criarErro("Edição não encontrada", 404);
      }
      await edicaoRepository.deletarEdicao(id);
      return {
        sucesso: true,
        mensagem: "Edição deletada com sucesso!",
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new EdicaoService();
