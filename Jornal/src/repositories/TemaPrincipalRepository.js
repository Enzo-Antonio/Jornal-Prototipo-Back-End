const pool = require("../config/database.js");
const { criarErro } = require("../utils/errorJornal.js");

class TemaPrincipalRepository {
  async listarTemasPrincipais() {
    try {
      const [rows] = await pool.query("SELECT * FROM temas_principais");
      return rows;
    } catch (error) {
      throw criarErro("Erro ao listar temas principais", 500);
    }
  }

  async buscarTemaPrincipal(id) {
    try {
      const [rows] = await pool.query("SELECT * FROM temas_principais WHERE id = ?", [id]);
      return rows[0];
    } catch (error) {
      throw criarErro("Erro ao buscar tema principal", 500);
    }
  }

  async cadastrarTemaPrincipal(dados) {
    try {
      const [result] = await pool.query("INSERT INTO temas_principais SET ?", [dados]);
      return result.insertId;
    } catch (error) {
      throw criarErro("Erro ao cadastrar tema principal", 500);
    }
  }

  async atualizarTemaPrincipal(dados, id) {
    try {
      const [result] = await pool.query("UPDATE temas_principais SET ? WHERE id = ?", [dados, id]);
      return result.affectedRows;
    } catch (error) {
      throw criarErro("Erro ao atualizar tema principal", 500);
    }
  }

  async deletarTemaPrincipal(id) {
    try {
      const [result] = await pool.query("DELETE FROM temas_principais WHERE id = ?", [id]);
      return result.affectedRows;
    } catch (error) {
      throw criarErro("Erro ao deletar tema principal", 500);
    }
  }
}

module.exports = new TemaPrincipalRepository();
