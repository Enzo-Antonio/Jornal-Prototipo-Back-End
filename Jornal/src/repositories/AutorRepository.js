const pool = require("../config/database.js");
const { criarErro } = require("../utils/errorJornal.js");

class AutorRepository {
  async listarAutores() {
    try {
      const [rows] = await pool.query("SELECT * FROM autor");
      return rows;
    } catch (error) {
      throw criarErro("Erro ao listar autores", 500);
    }
  }

  async buscarAutor(id) {
    try {
      const [rows] = await pool.query("SELECT * FROM autor WHERE id = ?", [id]);
      return rows[0];
    } catch (error) {
      throw criarErro("Erro ao buscar autor", 500);
    }
  }

  async cadastrarAutor(dados) {
    try {
      const [result] = await pool.query("INSERT INTO autor SET ?", [dados]);
      return result.insertId;
    } catch (error) {
      throw criarErro("Erro ao cadastrar autor", 500);
    }
  }

  async atualizarAutor(dados, id) {
    try {
      const [result] = await pool.query("UPDATE autor SET ? WHERE id = ?", [dados, id]);
      return result.affectedRows;
    } catch (error) {
      throw criarErro("Erro ao atualizar autor", 500);
    }
  }

  async deletarAutor(id) {
    try {
      const [result] = await pool.query("DELETE FROM autor WHERE id = ?", [id]);
      return result.affectedRows;
    } catch (error) {
      throw criarErro("Erro ao deletar autor", 500);
    }
  }
}

module.exports = new AutorRepository();
