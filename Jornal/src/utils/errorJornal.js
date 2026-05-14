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
    timestamp: new Date().toISOString()
  });
}

module.exports = erroCatch;
