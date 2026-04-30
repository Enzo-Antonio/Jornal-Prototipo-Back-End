const express = require("express");
const pool = require("./config/database");

const app = express();
app.use(express.json());

const queryAsync = (sql, values = []) => {
  return new Promise((resolve, reject) => {
    pool.query(sql, values, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

const verificarExistencia = (res, campos) => {
  for (let campo in campos) {
    if (!campos[campo]) {
      return res.status(400).json({
        sucesso: false,
        message: "eles não podem ser nulos",
        campo_errado: campo,
      });
    }
  }
  return true;
};

const verificarNumeroPositivo = (valor) => {
  return !isNaN(valor) && valor > 0;
};

app.get("/", (req, res) => {
  res.send("Jornal SESI");
});

app.get("/autores", async (req, res) => {
  try {
    const autores = await queryAsync("SELECT * FROM autor");
    res.json({
      sucesso: true,
      dados: autores,
      total: autores.length,
    });
  } catch (error) {
    console.error(`erro ao listar autores ${error}`);
    res.status(500).json({
      sucesso: false,
      message: "erro ao listar autores",
      erro: error.message,
    });
  }
});

app.get("/autores/:id", async (req, res) => {
  try {
    const {id} = req.params
    const usuarios = await queryAsync('SELECT * FROM autor WHERE id = ? ', [id])
    if (usuarios.length === 0) {
      res.status(404).json({
        sucesso: false,
        message: 'usuario não encontrado',
      })
    } else {
      res.status(200).json({
        sucesso: true,
        message: 'usuario identificado',
        dados: usuarios
      })
    }
  } catch (error) {
    console.error(`erro ao buscar autor: ${error}`);
    res.status(500).json({
      sucesso: false,
      message: "erro ao buscar autor",
      erro: error.message,
    });
  }
});

app.post("/autores", async (req, res) => {
  const { nome, serie, descricao, email, area } = req.body;

  if (verificarExistencia(res, { nome, serie, email }) !== true) return;
  if (!verificarNumeroPositivo(serie)) {
    return res.status(400).json({
      sucesso: false,
      message: "série deve ser um número positivo",
    });
  } 

  try {
    const novoAutor = {
      nome: nome.trim(),
      serie_escolar: serie,
      descricao: descricao ? descricao.trim() : null,
      email: email.trim(),
      area_interesse: area || null,
    };

    const resultado = await queryAsync("INSERT INTO autor SET ?", [novoAutor]);

    res.status(201).json({
      sucesso: true,
      message: "autor criado com sucesso!",
      id: resultado.insertId,
    });
  } catch (error) {
    console.error("Erro no banco:", error);
    res.status(500).json({
      sucesso: false,
      message: "erro ao salvar no banco de dados",
      erro: error.message,
    });
  }
});

app.put("/autores/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, serie, descricao, email, area } = req.body;

  try {
    if (!verificarNumeroPositivo(id)) {
      return res.status(400).json({
        sucesso: false,
        message: "id deve ser um número positivo",
      });
    }

    const autorExiste = await queryAsync("SELECT * FROM autor WHERE id = ?", [
      id,
    ]);

    if (autorExiste.length === 0) {
      return res.status(404).json({
        sucesso: false,
        message:
          "não foi possível identificar o autor para modifica-lo, tente novamente",
      });
    }

    const autorNovo = {};
    if (nome !== undefined) autorNovo.nome = nome.trim();
    if (email !== undefined) autorNovo.email = email.trim();
    if (serie !== undefined) {
      if (!verificarNumeroPositivo(serie)) {
        return res.status(400).json({
          sucesso: false,
          message: "série deve ser um número positivo",
        });
      }
      autorNovo.serie_escolar = serie;
    }
    if (descricao !== undefined)
      autorNovo.descricao = descricao ? descricao.trim() : null;
    if (area !== undefined)
      autorNovo.area_interesse = area ? area.trim() : null;

    if (Object.keys(autorNovo).length === 0) {
      return res
        .status(400)
        .json({ sucesso: false, message: "Nada para atualizar" });
    }

    await queryAsync("UPDATE autor SET ? WHERE id = ?", [autorNovo, id]);

    res.json({
      sucesso: true,
      message: "autor atualizado com sucesso!",
    });
  } catch (error) {
    res.status(500).json({
      sucesso: false,
      message: "erro ao atualizar autor",
      erro: error.message,
    });
  }
});

app.delete("/autores/:id", async (req, res) => {
  const { id } = req.params;
  if (!verificarNumeroPositivo(id)) {
    return res.status(400).json({
      sucesso: false,
      message: "id deve ser um número positivo",
    });
  }
  try {
    const autorExiste = await queryAsync("SELECT * FROM autor WHERE id = ?", [
      id,
    ]);
    if (autorExiste.length == 0) {
      return res
        .status(404)
        .json({ sucesso: false, message: "autor nao encontrado" });
    }
    await queryAsync("DELETE FROM autor WHERE id = ?", [id]);
    res.status(200).json({
      sucesso: true,
      message: 'autor deletado com sucesso'
    })
  } catch (error) {
    console.error("Erro ao deletar filme:", error);
    res.status(500).json({
      sucesso: false,
      mensagem: "erro ao deletar autor",
      erro: error.message,
    });
  }
});

module.exports = app;
