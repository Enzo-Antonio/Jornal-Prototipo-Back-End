const pool = require("../config/database.js");
const { criarErro } = require("../utils/errorJornal.js");

class StatusComentarioRepository {
  async listarStatusComentario() {
    try {
      const [rows] = await pool.query("SELECT * FROM status_comentario");
      return rows;
    } catch (error) {
      throw criarErro("Erro ao listar status de comentário", 500);
    }
  }

  async buscarStatusComentario(id) {
    try {
      const [rows] = await pool.query("SELECT * FROM status_comentario WHERE id = ?", [id]);
      return rows[0];
    } catch (error) {
      throw criarErro("Erro ao buscar status de comentário", 500);
    }
  }

  async cadastrarStatusComentario(dados) {
    try {
      const [result] = await pool.query("INSERT INTO status_comentario SET ?", [dados]);
      return result.insertId;
    } catch (error) {
      throw criarErro("Erro ao cadastrar status de comentário", 500);
    }
  }

  async atualizarStatusComentario(dados, id) {
    try {
      const [result] = await pool.query("UPDATE status_comentario SET ? WHERE id = ?", [dados, id]);
      return result.affectedRows;
    } catch (error) {
      throw criarErro("Erro ao atualizar status de comentário", 500);
    }
  }

  async deletarStatusComentario(id) {
    try {
      const [result] = await pool.query("DELETE FROM status_comentario WHERE id = ?", [id]);
      return result.affectedRows;
    } catch (error) {
      throw criarErro("Erro ao deletar status de comentário", 500);
    }
  }
}

module.exports = new StatusComentarioRepository();
