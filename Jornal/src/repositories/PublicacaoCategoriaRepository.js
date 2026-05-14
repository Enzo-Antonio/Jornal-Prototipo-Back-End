const pool = require("../config/database.js");
const { criarErro } = require("../utils/errorJornal.js");

class PublicacaoCategoriaRepository {
  async listarVinculos() {
    try {
      const [rows] = await pool.query("SELECT * FROM publicacao_categoria");
      return rows;
    } catch (error) {
      throw criarErro("Erro ao listar vínculos publicação-categoria", 500);
    }
  }

  async buscarVinculo(id) {
    try {
      const [rows] = await pool.query("SELECT * FROM publicacao_categoria WHERE id = ?", [id]);
      return rows[0];
    } catch (error) {
      throw criarErro("Erro ao buscar vínculo publicação-categoria", 500);
    }
  }

  async cadastrarVinculo(dados) {
    try {
      const [result] = await pool.query("INSERT INTO publicacao_categoria SET ?", [dados]);
      return result.insertId;
    } catch (error) {
      throw criarErro("Erro ao cadastrar vínculo publicação-categoria", 500);
    }
  }

  async atualizarVinculo(dados, id) {
    try {
      const [result] = await pool.query("UPDATE publicacao_categoria SET ? WHERE id = ?", [dados, id]);
      return result.affectedRows;
    } catch (error) {
      throw criarErro("Erro ao atualizar vínculo publicação-categoria", 500);
    }
  }

  async deletarVinculo(id) {
    try {
      const [result] = await pool.query("DELETE FROM publicacao_categoria WHERE id = ?", [id]);
      return result.affectedRows;
    } catch (error) {
      throw criarErro("Erro ao deletar vínculo publicação-categoria", 500);
    }
  }
}

module.exports = new PublicacaoCategoriaRepository();
