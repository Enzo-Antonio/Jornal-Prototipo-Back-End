/**
 * Cria um erro padronizado com status HTTP embutido na mensagem.
 * @param {string} mensagem - Descrição do erro
 * @param {number} status - Código HTTP (padrão: 500)
 */
function criarErro(mensagem, status = 500) {
  return new Error(`${mensagem}. Status:${status}`);
}

function erroCatch(req, res, error) {
  const message = error.message || "Erro interno no servidor";
  let status = 500;

  if (message.includes("Status:")) {
    const parts = message.split("Status:");
    status = parseInt(parts[1].trim());
  }

  console.error(`[ERRO] ${req.method} ${req.url} - ${message}`);

  res.status(status).json({
    sucesso: false,
    erro: message.split(". Status:")[0],
    timestamp: new Date().toISOString(),
  });
}

module.exports = { erroCatch, criarErro };
