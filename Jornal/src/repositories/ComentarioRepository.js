const pool = require("../config/database.js");
const { criarErro } = require("../utils/errorJornal.js");

class ComentarioRepository {
  async listarComentarios() {
    try {
      const [rows] = await pool.query("SELECT * FROM comentario");
      return rows;
    } catch (error) {
      throw criarErro("Erro ao listar comentários", 500);
    }
  }

  async buscarComentario(id) {
    try {
      const [rows] = await pool.query("SELECT * FROM comentario WHERE id = ?", [id]);
      return rows[0];
    } catch (error) {
      throw criarErro("Erro ao buscar comentário", 500);
    }
  }

  async cadastrarComentario(dados) {
    try {
      const [result] = await pool.query("INSERT INTO comentario SET ?", [dados]);
      return result.insertId;
    } catch (error) {
      throw criarErro("Erro ao cadastrar comentário", 500);
    }
  }

  async atualizarComentario(dados, id) {
    try {
      const [result] = await pool.query("UPDATE comentario SET ? WHERE id = ?", [dados, id]);
      return result.affectedRows;
    } catch (error) {
      throw criarErro("Erro ao atualizar comentário", 500);
    }
  }

  async deletarComentario(id) {
    try {
      const [result] = await pool.query("DELETE FROM comentario WHERE id = ?", [id]);
      return result.affectedRows;
    } catch (error) {
      throw criarErro("Erro ao deletar comentário", 500);
    }
  }
}

module.exports = new ComentarioRepository();
