const autorRepository = require("../repositories/Autor.js");

function validarNumero(id) {
  return id && !isNaN(id) && Number(id) > 0;
}

class AutorService {
  async listarAutores() {
    const autores = await autorRepository.listarAutores();
    return {
      sucesso: true,
      dados: autores,
      total: autores.length,
    };
  }

  async buscarAutor(id) {
    if (!validarNumero(id)) {
      throw new Error("ID inválido. Status:400");
    }
    const autor = await autorRepository.buscarAutor(id);
    if (!autor) {
      throw new Error("Autor não encontrado. Status:404");
    }
    return {
      sucesso: true,
      dados: autor,
    };
  }

  async cadastrarAutor(dados) {
    const { nome, serie_escolar, email, descricao, area_interesse } = dados;
    
    if (!nome || !serie_escolar || !email) {
      throw new Error("Nome, série escolar e email são obrigatórios. Status:400");
    }

    const novoAutor = {
      nome: nome.trim(),
      serie_escolar: serie_escolar.trim(),
      email: email.trim(),
      descricao: descricao ? descricao.trim() : null,
      area_interesse: area_interesse ? area_interesse.trim() : null,
      ativo: true
    };

    const id = await autorRepository.cadastrarAutor(novoAutor);
    return {
      sucesso: true,
      mensagem: "Autor cadastrado com sucesso!",
      id,
    };
  }

  async atualizarAutor(dados, id) {
    if (!validarNumero(id)) {
      throw new Error("ID inválido. Status:400");
    }

    const autorExistente = await autorRepository.buscarAutor(id);
    if (!autorExistente) {
      throw new Error("Autor não encontrado. Status:404");
    }

    const autorAtualizado = {};
    if (dados.nome) autorAtualizado.nome = dados.nome.trim();
    if (dados.serie_escolar) autorAtualizado.serie_escolar = dados.serie_escolar.trim();
    if (dados.email) autorAtualizado.email = dados.email.trim();
    if (dados.descricao !== undefined) autorAtualizado.descricao = dados.descricao;
    if (dados.area_interesse !== undefined) autorAtualizado.area_interesse = dados.area_interesse;
    if (dados.ativo !== undefined) autorAtualizado.ativo = dados.ativo;

    if (Object.keys(autorAtualizado).length === 0) {
      throw new Error("Nenhuma alteração fornecida. Status:400");
    }

    await autorRepository.atualizarAutor(autorAtualizado, id);
    return {
      sucesso: true,
      mensagem: "Autor atualizado com sucesso!",
    };
  }

  async deletarAutor(id) {
    if (!validarNumero(id)) {
      throw new Error("ID inválido. Status:400");
    }

    const autorExistente = await autorRepository.buscarAutor(id);
    if (!autorExistente) {
      throw new Error("Autor não encontrado. Status:404");
    }

    await autorRepository.deletarAutor(id);
    return {
      sucesso: true,
      mensagem: "Autor deletado com sucesso!",
    };
  }
}

module.exports = new AutorService();
