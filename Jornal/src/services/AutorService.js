const autorRepository = require("../repositories/AutorRepository.js");
const { criarErro } = require("../utils/errorJornal.js");

function validarNumero(id) {
  return id && !isNaN(id) && Number(id) > 0;
}

class AutorService {
  async listarAutores() {
    try {
      const autores = await autorRepository.listarAutores();
      return { sucesso: true, dados: autores, total: autores.length };
    } catch (error) { throw error; }
  }

  async buscarAutor(id) {
    try {
      if (!validarNumero(id)) throw criarErro("ID inválido", 400);
      const autor = await autorRepository.buscarAutor(id);
      if (!autor) throw criarErro("Autor não encontrado", 404);
      return { sucesso: true, dados: autor };
    } catch (error) { throw error; }
  }

  async cadastrarAutor(dados) {
    try {
      const { nome, serie_escolar, email, descricao, area_interesse } = dados;
      if (!nome || !serie_escolar || !email) {
        throw criarErro("Nome, série escolar e email são obrigatórios", 400);
      }
      const novoAutor = {
        nome: nome.trim(),
        serie_escolar: serie_escolar.trim(),
        email: email.trim(),
        descricao: descricao ? descricao.trim() : null,
        area_interesse: area_interesse ? area_interesse.trim() : null,
      };
      const id = await autorRepository.cadastrarAutor(novoAutor);
      return { sucesso: true, mensagem: "Autor cadastrado com sucesso!", id };
    } catch (error) { throw error; }
  }

  async atualizarAutor(dados, id) {
    try {
      if (!validarNumero(id)) throw criarErro("ID inválido", 400);
      const autorExistente = await autorRepository.buscarAutor(id);
      if (!autorExistente) throw criarErro("Autor não encontrado", 404);
      const autorAtualizado = {};
      if (dados.nome) autorAtualizado.nome = dados.nome.trim();
      if (dados.serie_escolar) autorAtualizado.serie_escolar = dados.serie_escolar.trim();
      if (dados.email) autorAtualizado.email = dados.email.trim();
      if (dados.descricao !== undefined) autorAtualizado.descricao = dados.descricao;
      if (dados.area_interesse !== undefined) autorAtualizado.area_interesse = dados.area_interesse;
      if (Object.keys(autorAtualizado).length === 0) throw criarErro("Nenhuma alteração fornecida", 400);
      await autorRepository.atualizarAutor(autorAtualizado, id);
      return { sucesso: true, mensagem: "Autor atualizado com sucesso!" };
    } catch (error) { throw error; }
  }

  async deletarAutor(id) {
    try {
      if (!validarNumero(id)) throw criarErro("ID inválido", 400);
      const autorExistente = await autorRepository.buscarAutor(id);
      if (!autorExistente) throw criarErro("Autor não encontrado", 404);
      await autorRepository.deletarAutor(id);
      return { sucesso: true, mensagem: "Autor deletado com sucesso!" };
    } catch (error) { throw error; }
  }
}

module.exports = new AutorService();
