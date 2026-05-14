const pool = require("../config/database.js");
const { criarErro } = require("../utils/errorJornal.js");

class StatusEdicaoRepository {
  async listarStatusEdicao() {
    try {
      const [rows] = await pool.query("SELECT * FROM status_edicao");
      return rows;
    } catch (error) {
      throw criarErro("Erro ao listar status de edição", 500);
    }
  }

  async buscarStatusEdicao(id) {
    try {
      const [rows] = await pool.query("SELECT * FROM status_edicao WHERE id = ?", [id]);
      return rows[0];
    } catch (error) {
      throw criarErro("Erro ao buscar status de edição", 500);
    }
  }

  async cadastrarStatusEdicao(dados) {
    try {
      const [result] = await pool.query("INSERT INTO status_edicao SET ?", [dados]);
      return result.insertId;
    } catch (error) {
      throw criarErro("Erro ao cadastrar status de edição", 500);
    }
  }

  async atualizarStatusEdicao(dados, id) {
    try {
      const [result] = await pool.query("UPDATE status_edicao SET ? WHERE id = ?", [dados, id]);
      return result.affectedRows;
    } catch (error) {
      throw criarErro("Erro ao atualizar status de edição", 500);
    }
  }

  async deletarStatusEdicao(id) {
    try {
      const [result] = await pool.query("DELETE FROM status_edicao WHERE id = ?", [id]);
      return result.affectedRows;
    } catch (error) {
      throw criarErro("Erro ao deletar status de edição", 500);
    }
  }
}

module.exports = new StatusEdicaoRepository();
