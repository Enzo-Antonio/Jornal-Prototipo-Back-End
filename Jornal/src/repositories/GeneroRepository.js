const pool = require("../config/database.js");
const { criarErro } = require("../utils/errorJornal.js");

class GeneroRepository {
  async listarGeneros() {
    try {
      const [rows] = await pool.query("SELECT * FROM generos");
      return rows;
    } catch (error) {
      throw criarErro("Erro ao listar gêneros", 500);
    }
  }

  async buscarGenero(id) {
    try {
      const [rows] = await pool.query("SELECT * FROM generos WHERE id = ?", [id]);
      return rows[0];
    } catch (error) {
      throw criarErro("Erro ao buscar gênero", 500);
    }
  }

  async cadastrarGenero(dados) {
    try {
      const [result] = await pool.query("INSERT INTO generos SET ?", [dados]);
      return result.insertId;
    } catch (error) {
      throw criarErro("Erro ao cadastrar gênero", 500);
    }
  }

  async atualizarGenero(dados, id) {
    try {
      const [result] = await pool.query("UPDATE generos SET ? WHERE id = ?", [dados, id]);
      return result.affectedRows;
    } catch (error) {
      throw criarErro("Erro ao atualizar gênero", 500);
    }
  }

  async deletarGenero(id) {
    try {
      const [result] = await pool.query("DELETE FROM generos WHERE id = ?", [id]);
      return result.affectedRows;
    } catch (error) {
      throw criarErro("Erro ao deletar gênero", 500);
    }
  }
}

module.exports = new GeneroRepository();
