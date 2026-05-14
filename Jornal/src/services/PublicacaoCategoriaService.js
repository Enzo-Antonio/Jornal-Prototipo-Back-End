const publicacaoCategoriaRepository = require("../repositories/PublicacaoCategoriaRepository.js");
const { criarErro } = require("../utils/errorJornal.js");

function validarNumero(id) {
  return id && !isNaN(id) && Number(id) > 0;
}

class PublicacaoCategoriaService {
  async listarVinculos() {
    try {
      const vinculos = await publicacaoCategoriaRepository.listarVinculos();
      return {
        sucesso: true,
        dados: vinculos,
        total: vinculos.length,
      };
    } catch (error) {
      throw error;
    }
  }

  async buscarVinculo(id) {
    try {
      if (!validarNumero(id)) {
        throw criarErro("ID inválido", 400);
      }
      const vinculo = await publicacaoCategoriaRepository.buscarVinculo(id);
      if (!vinculo) {
        throw criarErro("Vínculo publicação-categoria não encontrado", 404);
      }
      return {
        sucesso: true,
        dados: vinculo,
      };
    } catch (error) {
      throw error;
    }
  }

  async cadastrarVinculo(dados) {
    try {
      const { publicacao_id, categoria_id } = dados;
      if (!publicacao_id || !categoria_id) {
        throw criarErro("Publicação e categoria são obrigatórios", 400);
      }
      const novo = {
        publicacao_id: Number(publicacao_id),
        categoria_id: Number(categoria_id),
      };
      const id = await publicacaoCategoriaRepository.cadastrarVinculo(novo);
      return {
        sucesso: true,
        mensagem: "Vínculo cadastrado com sucesso!",
        id,
      };
    } catch (error) {
      throw error;
    }
  }

  async atualizarVinculo(dados, id) {
    try {
      if (!validarNumero(id)) {
        throw criarErro("ID inválido", 400);
      }
      const existente = await publicacaoCategoriaRepository.buscarVinculo(id);
      if (!existente) {
        throw criarErro("Vínculo publicação-categoria não encontrado", 404);
      }
      const atualizado = {};
      if (dados.publicacao_id !== undefined) atualizado.publicacao_id = Number(dados.publicacao_id);
      if (dados.categoria_id !== undefined) atualizado.categoria_id = Number(dados.categoria_id);
      if (Object.keys(atualizado).length === 0) {
        throw criarErro("Nenhuma alteração fornecida", 400);
      }
      await publicacaoCategoriaRepository.atualizarVinculo(atualizado, id);
      return {
        sucesso: true,
        mensagem: "Vínculo atualizado com sucesso!",
      };
    } catch (error) {
      throw error;
    }
  }

  async deletarVinculo(id) {
    try {
      if (!validarNumero(id)) {
        throw criarErro("ID inválido", 400);
      }
      const existente = await publicacaoCategoriaRepository.buscarVinculo(id);
      if (!existente) {
        throw criarErro("Vínculo publicação-categoria não encontrado", 404);
      }
      await publicacaoCategoriaRepository.deletarVinculo(id);
      return {
        sucesso: true,
        mensagem: "Vínculo deletado com sucesso!",
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new PublicacaoCategoriaService();
