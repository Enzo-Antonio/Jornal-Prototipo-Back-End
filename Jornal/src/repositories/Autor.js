const pool = require("../config/database.js");

class AutorRepository {
  async listarAutores() {
    const [rows] = await pool.query("SELECT * FROM autor");
    return rows;
  }

  async buscarAutor(id) {
    const [rows] = await pool.query("SELECT * FROM autor WHERE id = ?", [id]);
    return rows[0];
  }

  async cadastrarAutor(dados) {
    const [result] = await pool.query("INSERT INTO autor SET ?", [dados]);
    return result.insertId;
  }

  async atualizarAutor(dados, id) {
    const [result] = await pool.query("UPDATE autor SET ? WHERE id = ?", [dados, id]);
    return result.affectedRows;
  }

  async deletarAutor(id) {
    const [result] = await pool.query("DELETE FROM autor WHERE id = ?", [id]);
    return result.affectedRows;
  }
}

module.exports = new AutorRepository();
