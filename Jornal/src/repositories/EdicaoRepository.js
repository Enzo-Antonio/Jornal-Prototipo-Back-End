const pool = require("../config/database.js");
const { criarErro } = require("../utils/errorJornal.js");

class EdicaoRepository {
  async listarEdicoes() {
    try {
      const [rows] = await pool.query("SELECT * FROM edicao");
      return rows;
    } catch (error) {
      throw criarErro("Erro ao listar edições", 500);
    }
  }

  async buscarEdicao(id) {
    try {
      const [rows] = await pool.query("SELECT * FROM edicao WHERE id = ?", [id]);
      return rows[0];
    } catch (error) {
      throw criarErro("Erro ao buscar edição", 500);
    }
  }

  async cadastrarEdicao(dados) {
    try {
      const [result] = await pool.query("INSERT INTO edicao SET ?", [dados]);
      return result.insertId;
    } catch (error) {
      throw criarErro("Erro ao cadastrar edição", 500);
    }
  }

  async atualizarEdicao(dados, id) {
    try {
      const [result] = await pool.query("UPDATE edicao SET ? WHERE id = ?", [dados, id]);
      return result.affectedRows;
    } catch (error) {
      throw criarErro("Erro ao atualizar edição", 500);
    }
  }

  async deletarEdicao(id) {
    try {
      await pool.query("UPDATE publicacao SET edicao_id = NULL WHERE edicao_id = ?", [id]);
      const [result] = await pool.query("DELETE FROM edicao WHERE id = ?", [id]);
      return result.affectedRows;
    } catch (error) {
      throw criarErro("Erro ao deletar edição", 500);
    }
  }
}

module.exports = new EdicaoRepository();
