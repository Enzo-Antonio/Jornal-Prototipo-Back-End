const comentarioRepository = require("../repositories/ComentarioRepository.js");
const { criarErro } = require("../utils/errorJornal.js");

function validarNumero(id) {
  return id && !isNaN(id) && Number(id) > 0;
}

class ComentarioService {
  async listarComentarios() {
    try {
      const comentarios = await comentarioRepository.listarComentarios();
      return {
        sucesso: true,
        dados: comentarios,
        total: comentarios.length,
      };
    } catch (error) {
      throw error;
    }
  }

  async buscarComentario(id) {
    try {
      if (!validarNumero(id)) {
        throw criarErro("ID inválido", 400);
      }
      const comentario = await comentarioRepository.buscarComentario(id);
      if (!comentario) {
        throw criarErro("Comentário não encontrado", 404);
      }
      return {
        sucesso: true,
        dados: comentario,
      };
    } catch (error) {
      throw error;
    }
  }

  async cadastrarComentario(dados) {
    try {
      const { publicacao_id, nome_autor, conteudo, status_id } = dados;
      if (!publicacao_id || !nome_autor || !conteudo || !status_id) {
        throw criarErro("Publicação, nome do autor, conteúdo e status são obrigatórios", 400);
      }
      const curtidas =
        dados.curtidas !== undefined && dados.curtidas !== null ? Number(dados.curtidas) : 0;
      if (curtidas < 0) {
        throw criarErro("Curtidas não podem ser negativas", 400);
      }
      const novo = {
        publicacao_id: Number(publicacao_id),
        nome_autor: nome_autor.trim(),
        email_autor: dados.email_autor != null ? String(dados.email_autor).trim() : null,
        conteudo: String(conteudo),
        curtidas,
        status_id: Number(status_id),
        ip_autor: dados.ip_autor != null ? String(dados.ip_autor).trim() : null,
      };
      if (dados.data_hora) {
        novo.data_hora = dados.data_hora;
      }
      const id = await comentarioRepository.cadastrarComentario(novo);
      return {
        sucesso: true,
        mensagem: "Comentário cadastrado com sucesso!",
        id,
      };
    } catch (error) {
      throw error;
    }
  }

  async atualizarComentario(dados, id) {
    try {
      if (!validarNumero(id)) {
        throw criarErro("ID inválido", 400);
      }
      const existente = await comentarioRepository.buscarComentario(id);
      if (!existente) {
        throw criarErro("Comentário não encontrado", 404);
      }
      const atualizado = {};
      if (dados.publicacao_id !== undefined) atualizado.publicacao_id = Number(dados.publicacao_id);
      if (dados.nome_autor) atualizado.nome_autor = dados.nome_autor.trim();
      if (dados.email_autor !== undefined) atualizado.email_autor = dados.email_autor;
      if (dados.conteudo) atualizado.conteudo = dados.conteudo;
      if (dados.data_hora) atualizado.data_hora = dados.data_hora;
      if (dados.curtidas !== undefined) {
        const c = Number(dados.curtidas);
        if (c < 0) {
          throw criarErro("Curtidas não podem ser negativas", 400);
        }
        atualizado.curtidas = c;
      }
      if (dados.status_id !== undefined) atualizado.status_id = Number(dados.status_id);
      if (dados.ip_autor !== undefined) atualizado.ip_autor = dados.ip_autor;
      if (Object.keys(atualizado).length === 0) {
        throw criarErro("Nenhuma alteração fornecida", 400);
      }
      await comentarioRepository.atualizarComentario(atualizado, id);
      return {
        sucesso: true,
        mensagem: "Comentário atualizado com sucesso!",
      };
    } catch (error) {
      throw error;
    }
  }

  async deletarComentario(id) {
    try {
      if (!validarNumero(id)) {
        throw criarErro("ID inválido", 400);
      }
      const existente = await comentarioRepository.buscarComentario(id);
      if (!existente) {
        throw criarErro("Comentário não encontrado", 404);
      }
      await comentarioRepository.deletarComentario(id);
      return {
        sucesso: true,
        mensagem: "Comentário deletado com sucesso!",
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ComentarioService();
