const publicacaoRepository = require("../repositories/PublicacaoRepository.js");
const { criarErro } = require("../utils/errorJornal.js");

function validarNumero(id) {
  return id && !isNaN(id) && Number(id) > 0;
}

class PublicacaoService {
  async listarPublicacoes() {
    try {
      const publicacoes = await publicacaoRepository.listarPublicacoes();
      return {
        sucesso: true,
        dados: publicacoes,
        total: publicacoes.length,
      };
    } catch (error) {
      throw error;
    }
  }

  async buscarPublicacao(id) {
    try {
      if (!validarNumero(id)) {
        throw criarErro("ID inválido", 400);
      }
      const publicacao = await publicacaoRepository.buscarPublicacao(id);
      if (!publicacao) {
        throw criarErro("Publicação não encontrada", 404);
      }
      return {
        sucesso: true,
        dados: publicacao,
      };
    } catch (error) {
      throw error;
    }
  }

  async cadastrarPublicacao(dados) {
    try {
      const { titulo, data_criacao, autor_id, genero_id, tema_principal_id } = dados;
      if (!titulo || !data_criacao || !autor_id || !genero_id || !tema_principal_id) {
        throw criarErro(
          "Título, data de criação, autor, gênero e tema principal são obrigatórios",
          400
        );
      }
      const novo = {
        titulo: titulo.trim(),
        subtitulo: dados.subtitulo != null ? String(dados.subtitulo).trim() : null,
        conteudo: dados.conteudo != null ? dados.conteudo : null,
        resumo: dados.resumo != null ? dados.resumo : null,
        data_criacao,
        data_publicacao: dados.data_publicacao != null ? dados.data_publicacao : null,
        imagem_destaque: dados.imagem_destaque != null ? String(dados.imagem_destaque).trim() : null,
        visualizacoes: dados.visualizacoes !== undefined ? Number(dados.visualizacoes) : 0,
        destaque: dados.destaque !== undefined ? Boolean(dados.destaque) : false,
        autor_id: Number(autor_id),
        edicao_id: dados.edicao_id != null && dados.edicao_id !== "" ? Number(dados.edicao_id) : null,
        genero_id: Number(genero_id),
        tema_principal_id: Number(tema_principal_id),
      };
      const id = await publicacaoRepository.cadastrarPublicacao(novo);
      return {
        sucesso: true,
        mensagem: "Publicação cadastrada com sucesso!",
        id,
      };
    } catch (error) {
      throw error;
    }
  }

  async atualizarPublicacao(dados, id) {
    try {
      if (!validarNumero(id)) {
        throw criarErro("ID inválido", 400);
      }
      const existente = await publicacaoRepository.buscarPublicacao(id);
      if (!existente) {
        throw criarErro("Publicação não encontrada", 404);
      }
      const atualizado = {};
      if (dados.titulo) atualizado.titulo = dados.titulo.trim();
      if (dados.subtitulo !== undefined) atualizado.subtitulo = dados.subtitulo;
      if (dados.conteudo !== undefined) atualizado.conteudo = dados.conteudo;
      if (dados.resumo !== undefined) atualizado.resumo = dados.resumo;
      if (dados.data_criacao) atualizado.data_criacao = dados.data_criacao;
      if (dados.data_publicacao !== undefined) atualizado.data_publicacao = dados.data_publicacao;
      if (dados.imagem_destaque !== undefined) atualizado.imagem_destaque = dados.imagem_destaque;
      if (dados.visualizacoes !== undefined) atualizado.visualizacoes = Number(dados.visualizacoes);
      if (dados.destaque !== undefined) atualizado.destaque = Boolean(dados.destaque);
      if (dados.autor_id !== undefined) atualizado.autor_id = Number(dados.autor_id);
      if (dados.edicao_id !== undefined) {
        atualizado.edicao_id =
          dados.edicao_id === null || dados.edicao_id === "" ? null : Number(dados.edicao_id);
      }
      if (dados.genero_id !== undefined) atualizado.genero_id = Number(dados.genero_id);
      if (dados.tema_principal_id !== undefined) {
        atualizado.tema_principal_id = Number(dados.tema_principal_id);
      }
      if (Object.keys(atualizado).length === 0) {
        throw criarErro("Nenhuma alteração fornecida", 400);
      }
      await publicacaoRepository.atualizarPublicacao(atualizado, id);
      return {
        sucesso: true,
        mensagem: "Publicação atualizada com sucesso!",
      };
    } catch (error) {
      throw error;
    }
  }

  async deletarPublicacao(id) {
    try {
      if (!validarNumero(id)) {
        throw criarErro("ID inválido", 400);
      }
      const existente = await publicacaoRepository.buscarPublicacao(id);
      if (!existente) {
        throw criarErro("Publicação não encontrada", 404);
      }
      await publicacaoRepository.deletarPublicacao(id);
      return {
        sucesso: true,
        mensagem: "Publicação deletada com sucesso!",
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new PublicacaoService();
