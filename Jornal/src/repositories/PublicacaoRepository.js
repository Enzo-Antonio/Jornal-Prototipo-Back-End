const pool = require("../config/database.js");
const { criarErro } = require("../utils/errorJornal.js");

class PublicacaoRepository {
  async listarPublicacoes() {
    try {
      const [rows] = await pool.query("SELECT * FROM publicacao");
      return rows;
    } catch (error) {
      throw criarErro("Erro ao listar publicações", 500);
    }
  }

  async buscarPublicacao(id) {
    try {
      const [rows] = await pool.query("SELECT * FROM publicacao WHERE id = ?", [id]);
      return rows[0];
    } catch (error) {
      throw criarErro("Erro ao buscar publicação", 500);
    }
  }

  async cadastrarPublicacao(dados) {
    try {
      const [result] = await pool.query("INSERT INTO publicacao SET ?", [dados]);
      return result.insertId;
    } catch (error) {
      throw criarErro("Erro ao cadastrar publicação", 500);
    }
  }

  async atualizarPublicacao(dados, id) {
    try {
      const [result] = await pool.query("UPDATE publicacao SET ? WHERE id = ?", [dados, id]);
      return result.affectedRows;
    } catch (error) {
      throw criarErro("Erro ao atualizar publicação", 500);
    }
  }

  async deletarPublicacao(id) {
    try {
      await pool.query("DELETE FROM publicacao_categoria WHERE publicacao_id = ?", [id]);
      await pool.query("DELETE FROM comentario WHERE publicacao_id = ?", [id]);
      const [result] = await pool.query("DELETE FROM publicacao WHERE id = ?", [id]);
      return result.affectedRows;
    } catch (error) {
      throw criarErro("Erro ao deletar publicação", 500);
    }
  }
}

module.exports = new PublicacaoRepository();
