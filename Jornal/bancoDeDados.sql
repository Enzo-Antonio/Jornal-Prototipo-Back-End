-- ============================================================================
-- BANCO DE DADOS: JORNAL SESI
-- Versão melhorada com relacionamentos completos, constraints e validações
-- ============================================================================

CREATE DATABASE db_jornal_sesi;
USE db_jornal_sesi;

-- ============================================================================
-- ============================================================================

-- Gêneros de publicação
CREATE TABLE generos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE,
    descricao TEXT
);

-- Temas principais
CREATE TABLE temas_principais (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    descricao TEXT
);

-- Categorias (filtros temáticos)
CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sigla VARCHAR(10) NOT NULL UNIQUE,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT
);

-- Status de edição
CREATE TABLE status_edicao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(20) NOT NULL UNIQUE
);

-- Status de comentário
CREATE TABLE status_comentario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(20) NOT NULL UNIQUE
);

-- ============================================================================
-- ============================================================================

-- Autores das publicações
CREATE TABLE autor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    serie_escolar VARCHAR(20) NOT NULL,
    descricao VARCHAR(500),
    email VARCHAR(100) NOT NULL UNIQUE,
    area_interesse VARCHAR(100),
    ativo BOOLEAN DEFAULT TRUE
);

-- Edições do jornal
CREATE TABLE edicao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero INT NOT NULL UNIQUE,
    titulo VARCHAR(100) NOT NULL,
    data_lancamento DATE NOT NULL,
    editorial TEXT,
    status_id INT NOT NULL,
    capa_imagem VARCHAR(255),
    CONSTRAINT fk_edicao_status 
        FOREIGN KEY (status_id) 
        REFERENCES status_edicao(id)
);

-- Publicações (artigos, reportagens, etc)
CREATE TABLE publicacao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    subtitulo VARCHAR(200),
    conteudo MEDIUMTEXT,
    resumo TEXT,
    data_criacao DATE NOT NULL,
    data_publicacao DATE,
    imagem_destaque VARCHAR(255),
    visualizacoes INT DEFAULT 0,
    destaque BOOLEAN DEFAULT FALSE,
    
    -- Foreign Keys
    autor_id INT NOT NULL,
    edicao_id INT,
    genero_id INT NOT NULL,
    tema_principal_id INT NOT NULL,
    
    CONSTRAINT fk_publicacao_autor 
        FOREIGN KEY (autor_id) 
        REFERENCES autor(id),
    
    CONSTRAINT fk_publicacao_edicao 
        FOREIGN KEY (edicao_id) 
        REFERENCES edicao(id),
    
    CONSTRAINT fk_publicacao_genero 
        FOREIGN KEY (genero_id) 
        REFERENCES generos(id),
    
    CONSTRAINT fk_publicacao_tema 
        FOREIGN KEY (tema_principal_id) 
        REFERENCES temas_principais(id)
        
);

-- Comentários nas publicações
CREATE TABLE comentario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    publicacao_id INT NOT NULL,
    nome_autor VARCHAR(100) NOT NULL,
    email_autor VARCHAR(100),
    conteudo TEXT NOT NULL,
    data_hora DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    curtidas INT DEFAULT 0,
    status_id INT NOT NULL,
    ip_autor VARCHAR(45),
    
    CONSTRAINT fk_comentario_publicacao 
        FOREIGN KEY (publicacao_id) 
        REFERENCES publicacao(id),
    
    CONSTRAINT fk_comentario_status 
        FOREIGN KEY (status_id) 
        REFERENCES status_comentario(id),
    
    CONSTRAINT chk_curtidas_positivas 
        CHECK (curtidas >= 0)
        
);
-- ============================================================================
-- TABELA DE RELACIONAMENTO N-N
-- ============================================================================

-- Relacionamento Categoria x Publicação (muitos para muitos)
CREATE TABLE publicacao_categoria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    publicacao_id INT NOT NULL,
    categoria_id INT NOT NULL,
    
    CONSTRAINT fk_pubcat_publicacao 
        FOREIGN KEY (publicacao_id) 
        REFERENCES publicacao(id),
    
    CONSTRAINT fk_pubcat_categoria 
        FOREIGN KEY (categoria_id) 
        REFERENCES categorias(id),
    
    CONSTRAINT uk_publicacao_categoria 
        UNIQUE (publicacao_id, categoria_id)
);

-- ============================================================================
-- POPULAÇÃO INICIAL DAS TABELAS DE DOMÍNIO
-- ============================================================================

-- Gêneros
INSERT INTO generos (nome, descricao) VALUES 
    ('Editorial', 'Texto que expressa a opinião oficial do jornal'),
    ('Charge', 'Ilustração satírica com crítica social ou política'),
    ('Crônica', 'Texto narrativo curto sobre fatos cotidianos'),
    ('Manifesto', 'Declaração pública de princípios e intenções'),
    ('Carta Aberta', 'Mensagem dirigida a alguém mas de interesse público'),
    ('Resenha/Síntese', 'Análise crítica de obra, evento ou tema'),
    ('Diário/Depoimento Pessoal', 'Relato em primeira pessoa de experiências'),
    ('Reportagem', 'Texto jornalístico investigativo e aprofundado'),
    ('Artigo de Opinião', 'Texto argumentativo com ponto de vista do autor'),
    ('Artigo Científico', 'Texto acadêmico com rigor metodológico'),
    ('Nota de Esclarecimento', 'Comunicado oficial sobre fato ou boato'),
    ('Entrevista', 'Conversa com personalidade sobre tema relevante'),
    ('Informativo Institucional', 'Comunicação oficial da instituição'),
    ('Desenho', 'Ilustração artística'),
    ('Tirinha', 'História em quadrinhos curta'),
    ('Palavra-Cruzada', 'Jogo de palavras');

-- Temas Principais
INSERT INTO temas_principais (nome, descricao) VALUES 
    ('Conflitos Bélicos', 'Guerras, tensões internacionais e questões militares'),
    ('Legislações Atuais', 'Leis, projetos de lei e mudanças jurídicas'),
    ('Avanço Tecnológico', 'Inovações tecnológicas e impactos sociais'),
    ('Violência e Segurança Pública', 'Criminalidade, policiamento e justiça'),
    ('Meio Ambiente', 'Questões ecológicas e sustentabilidade'),
    ('Eleições', 'Processos eleitorais e política partidária'),
    ('Saúde', 'Questões médicas e de saúde pública'),
    ('Ciência', 'Pesquisas científicas e descobertas'),
    ('Vício em Jogos de Azar', 'Dependência e regulação de apostas');

-- Categorias (com siglas)
INSERT INTO categorias (sigla, nome, descricao) VALUES 
    ('CB', 'Conflitos Bélicos', 'Soberania nacional, liberdade de expressão, polarização política'),
    ('LA', 'Legislações Atuais', 'Lei anti-misoginia, Lei Felca, PL da escala 6x1, etc'),
    ('AT', 'Avanço Tecnológico', 'Produção de jatos, IA, impactos tecnológicos'),
    ('VSP', 'Violência e Segurança', 'Ação policial, racismo, machosfera, justiça social'),
    ('MA', 'Meio Ambiente', 'Desastres climáticos, agronegócio, recursos hídricos'),
    ('EL', 'Eleições', 'Representatividade política, polarização, fake news'),
    ('SA', 'Saúde', 'Medicalização, transtornos mentais, saúde mental'),
    ('CI', 'Ciência', 'Descredibilização, cortes orçamentários, profissionalização'),
    ('VJA', 'Vício em Jogos', 'Apostas infantis e dependência');

-- Status de Edição
INSERT INTO status_edicao (nome) VALUES 
    ('Rascunho'),
    ('Em Revisão'),
    ('Pronta'),
    ('Publicada'),
    ('Arquivada');

-- Status de Comentário
INSERT INTO status_comentario (nome) VALUES 
    ('Pendente'),
    ('Aprovado'),
    ('Rejeitado'),
    ('Spam');

-- ============================================================================
-- ============================================================================

-- View: Publicações com detalhes completos
CREATE VIEW vw_publicacoes_completas AS
SELECT 
    p.id,
    p.titulo,
    p.subtitulo,
    p.data_publicacao,
    p.visualizacoes,
    p.destaque,
    a.nome AS autor_nome,
    a.serie_escolar AS autor_serie,
    g.nome AS genero,
    t.nome AS tema_principal,
    e.numero AS edicao_numero,
    e.titulo AS edicao_titulo,
    COUNT(DISTINCT c.id) AS total_comentarios,
    GROUP_CONCAT(DISTINCT cat.sigla ORDER BY cat.sigla SEPARATOR ', ') AS categorias
FROM publicacao p
INNER JOIN autor a ON p.autor_id = a.id
INNER JOIN generos g ON p.genero_id = g.id
INNER JOIN temas_principais t ON p.tema_principal_id = t.id
LEFT JOIN edicao e ON p.edicao_id = e.id
LEFT JOIN comentario c ON p.id = c.publicacao_id AND c.status_id = (SELECT id FROM status_comentario WHERE nome = 'Aprovado')
LEFT JOIN publicacao_categoria pc ON p.id = pc.publicacao_id
LEFT JOIN categorias cat ON pc.categoria_id = cat.id
GROUP BY p.id, p.titulo, p.subtitulo, p.data_publicacao, p.visualizacoes, 
         p.destaque, a.nome, a.serie_escolar, g.nome, t.nome, e.numero, e.titulo;

-- View: Estatísticas por autor
CREATE VIEW vw_estatisticas_autor AS
SELECT 
    a.id,
    a.nome,
    a.serie_escolar,
    COUNT(p.id) AS total_publicacoes,
    SUM(p.visualizacoes) AS total_visualizacoes,
    AVG(p.visualizacoes) AS media_visualizacoes,
    COUNT(DISTINCT p.edicao_id) AS edicoes_participadas
FROM autor a
LEFT JOIN publicacao p ON a.id = p.autor_id
GROUP BY a.id, a.nome, a.serie_escolar;

-- View: Últimas publicações
CREATE VIEW vw_ultimas_publicacoes AS
SELECT 
    p.id,
    p.titulo,
    p.subtitulo,
    p.resumo,
    p.data_publicacao,
    p.imagem_destaque,
    a.nome AS autor_nome,
    g.nome AS genero,
    t.nome AS tema_principal
FROM publicacao p
INNER JOIN autor a ON p.autor_id = a.id
INNER JOIN generos g ON p.genero_id = g.id
INNER JOIN temas_principais t ON p.tema_principal_id = t.id
WHERE p.data_publicacao IS NOT NULL
ORDER BY p.data_publicacao DESC
LIMIT 10;