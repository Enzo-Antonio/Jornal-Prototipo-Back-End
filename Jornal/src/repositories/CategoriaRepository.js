const pool = require("../config/database.js");
const { criarErro } = require("../utils/errorJornal.js");

class CategoriaRepository {
  async listarCategorias() {
    try {
      const [rows] = await pool.query("SELECT * FROM categorias");
      return rows;
    } catch (error) {
      throw criarErro("Erro ao listar categorias", 500);
    }
  }

  async buscarCategoria(id) {
    try {
      const [rows] = await pool.query("SELECT * FROM categorias WHERE id = ?", [id]);
      return rows[0];
    } catch (error) {
      throw criarErro("Erro ao buscar categoria", 500);
    }
  }

  async cadastrarCategoria(dados) {
    try {
      const [result] = await pool.query("INSERT INTO categorias SET ?", [dados]);
      return result.insertId;
    } catch (error) {
      throw criarErro("Erro ao cadastrar categoria", 500);
    }
  }

  async atualizarCategoria(dados, id) {
    try {
      const [result] = await pool.query("UPDATE categorias SET ? WHERE id = ?", [dados, id]);
      return result.affectedRows;
    } catch (error) {
      throw criarErro("Erro ao atualizar categoria", 500);
    }
  }

  async deletarCategoria(id) {
    try {
      const [result] = await pool.query("DELETE FROM categorias WHERE id = ?", [id]);
      return result.affectedRows;
    } catch (error) {
      throw criarErro("Erro ao deletar categoria", 500);
    }
  }
}

module.exports = new CategoriaRepository();
