const categoriaRepository = require("../repositories/CategoriaRepository.js");
const { criarErro } = require("../utils/errorJornal.js");

function validarNumero(id) {
  return id && !isNaN(id) && Number(id) > 0;
}

class CategoriaService {
  async listarCategorias() {
    try {
      const categorias = await categoriaRepository.listarCategorias();
      return { sucesso: true, dados: categorias, total: categorias.length };
    } catch (error) { throw error; }
  }

  async buscarCategoria(id) {
    try {
      if (!validarNumero(id)) throw criarErro("ID inválido", 400);
      const categoria = await categoriaRepository.buscarCategoria(id);
      if (!categoria) throw criarErro("Categoria não encontrada", 404);
      return { sucesso: true, dados: categoria };
    } catch (error) { throw error; }
  }

  async cadastrarCategoria(dados) {
    try {
      const { sigla, nome, descricao } = dados;
      if (!sigla || !nome) throw criarErro("Sigla e nome são obrigatórios", 400);
      const novo = {
        sigla: sigla.trim(),
        nome: nome.trim(),
        descricao: descricao != null ? String(descricao).trim() : null,
      };
      const id = await categoriaRepository.cadastrarCategoria(novo);
      return { sucesso: true, mensagem: "Categoria cadastrada com sucesso!", id };
    } catch (error) { throw error; }
  }

  async atualizarCategoria(dados, id) {
    try {
      if (!validarNumero(id)) throw criarErro("ID inválido", 400);
      const existente = await categoriaRepository.buscarCategoria(id);
      if (!existente) throw criarErro("Categoria não encontrada", 404);
      const atualizado = {};
      if (dados.sigla) atualizado.sigla = dados.sigla.trim();
      if (dados.nome) atualizado.nome = dados.nome.trim();
      if (dados.descricao !== undefined) atualizado.descricao = dados.descricao;
      if (Object.keys(atualizado).length === 0) throw criarErro("Nenhuma alteração fornecida", 400);
      await categoriaRepository.atualizarCategoria(atualizado, id);
      return { sucesso: true, mensagem: "Categoria atualizada com sucesso!" };
    } catch (error) { throw error; }
  }

  async deletarCategoria(id) {
    try {
      if (!validarNumero(id)) throw criarErro("ID inválido", 400);
      const existente = await categoriaRepository.buscarCategoria(id);
      if (!existente) throw criarErro("Categoria não encontrada", 404);
      await categoriaRepository.deletarCategoria(id);
      return { sucesso: true, mensagem: "Categoria deletada com sucesso!" };
    } catch (error) { throw error; }
  }
}

module.exports = new CategoriaService();
