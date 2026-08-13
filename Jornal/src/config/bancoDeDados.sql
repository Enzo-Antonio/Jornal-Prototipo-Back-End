DROP DATABASE IF EXISTS db_jornal_sesi_testes;

CREATE DATABASE db_jornal_sesi_testes
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE db_jornal_sesi_testes;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- TABELAS DE DOMÍNIO
-- ============================================================

CREATE TABLE generos (
    id        INT AUTO_INCREMENT PRIMARY KEY,
    nome      VARCHAR(50) NOT NULL UNIQUE,
    descricao TEXT
);

CREATE TABLE temas_principais (
    id        INT AUTO_INCREMENT PRIMARY KEY,
    nome      VARCHAR(100) NOT NULL UNIQUE,
    descricao TEXT
);

CREATE TABLE categorias (
    id        INT AUTO_INCREMENT PRIMARY KEY,
    sigla     VARCHAR(10)  NOT NULL UNIQUE,
    nome      VARCHAR(100) NOT NULL,
    descricao TEXT
);

CREATE TABLE status_edicao (
    id   INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE status_comentario (
    id   INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(20) NOT NULL UNIQUE
);

-- ============================================================
-- TABELAS PRINCIPAIS
-- ============================================================

CREATE TABLE autor (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    nome           VARCHAR(100) NOT NULL,
    serie_escolar  VARCHAR(20)  NOT NULL,
    descricao      VARCHAR(500),
    email          VARCHAR(100) NOT NULL UNIQUE,
    area_interesse VARCHAR(100),
    foto           VARCHAR(255),
    cpf            VARCHAR(14),
    telefone       VARCHAR(15),
    senha          VARCHAR(255),
    ativo          BOOLEAN DEFAULT TRUE
);

CREATE TABLE edicao (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    numero          INT          NOT NULL UNIQUE,
    titulo          VARCHAR(100) NOT NULL,
    data_lancamento DATE         NOT NULL,
    editorial       TEXT,
    status_id       INT          NOT NULL,
    capa_imagem     VARCHAR(255),
    CONSTRAINT fk_edicao_status
        FOREIGN KEY (status_id) REFERENCES status_edicao(id)
);

CREATE TABLE publicacao (
    id                INT AUTO_INCREMENT PRIMARY KEY,
    titulo            VARCHAR(200) NOT NULL,
    subtitulo         VARCHAR(200),
    conteudo          MEDIUMTEXT,
    resumo            TEXT,
    data_criacao      DATE         NOT NULL,
    data_publicacao   DATE,
    imagem_destaque   VARCHAR(255),
    visualizacoes     INT     DEFAULT 0,
    curtidas          INT     DEFAULT 0,
    destaque          BOOLEAN DEFAULT FALSE,
    secao             VARCHAR(20)  NOT NULL DEFAULT 'noticias',
    autor_id          INT NOT NULL,
    edicao_id         INT,
    genero_id         INT NOT NULL,
    tema_principal_id INT NOT NULL,
    CONSTRAINT fk_publicacao_autor
        FOREIGN KEY (autor_id)          REFERENCES autor(id),
    CONSTRAINT fk_publicacao_edicao
        FOREIGN KEY (edicao_id)         REFERENCES edicao(id),
    CONSTRAINT fk_publicacao_genero
        FOREIGN KEY (genero_id)         REFERENCES generos(id),
    CONSTRAINT fk_publicacao_tema
        FOREIGN KEY (tema_principal_id) REFERENCES temas_principais(id),
    CONSTRAINT chk_pub_curtidas
        CHECK (curtidas >= 0)
);

CREATE TABLE comentario (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    publicacao_id INT          NOT NULL,
    nome_autor    VARCHAR(100) NOT NULL,
    email_autor   VARCHAR(100),
    conteudo      TEXT         NOT NULL,
    data_hora     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    curtidas      INT     DEFAULT 0,
    status_id     INT     NOT NULL,
    ip_autor      VARCHAR(45),
    CONSTRAINT fk_comentario_publicacao
        FOREIGN KEY (publicacao_id) REFERENCES publicacao(id),
    CONSTRAINT fk_comentario_status
        FOREIGN KEY (status_id)     REFERENCES status_comentario(id),
    CONSTRAINT chk_curtidas_positivas
        CHECK (curtidas >= 0)
);

-- Relacionamento muitos-para-muitos entre publicação e categoria
CREATE TABLE publicacao_categoria (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    publicacao_id INT NOT NULL,
    categoria_id  INT NOT NULL,
    CONSTRAINT fk_pubcat_publicacao
        FOREIGN KEY (publicacao_id) REFERENCES publicacao(id),
    CONSTRAINT fk_pubcat_categoria
        FOREIGN KEY (categoria_id)  REFERENCES categorias(id),
    CONSTRAINT uk_publicacao_categoria
        UNIQUE (publicacao_id, categoria_id)
);

-- ============================================================
-- VIEWS
-- ============================================================

CREATE VIEW vw_publicacoes_completas AS
SELECT
    p.id,
    p.titulo,
    p.subtitulo,
    p.data_publicacao,
    p.visualizacoes,
    p.destaque,
    a.nome                 AS autor_nome,
    a.serie_escolar        AS autor_serie,
    g.nome                 AS genero,
    t.nome                 AS tema_principal,
    e.numero               AS edicao_numero,
    e.titulo               AS edicao_titulo,
    COUNT(DISTINCT c.id)   AS total_comentarios,
    GROUP_CONCAT(DISTINCT cat.sigla ORDER BY cat.sigla SEPARATOR ', ') AS categorias
FROM publicacao p
INNER JOIN autor a           ON p.autor_id          = a.id
INNER JOIN generos g         ON p.genero_id          = g.id
INNER JOIN temas_principais t ON p.tema_principal_id = t.id
LEFT  JOIN edicao e          ON p.edicao_id          = e.id
LEFT  JOIN comentario c      ON p.id = c.publicacao_id
    AND c.status_id = (SELECT id FROM status_comentario WHERE nome = 'Aprovado')
LEFT  JOIN publicacao_categoria pc ON p.id           = pc.publicacao_id
LEFT  JOIN categorias cat          ON pc.categoria_id = cat.id
GROUP BY
    p.id, p.titulo, p.subtitulo, p.data_publicacao, p.visualizacoes,
    p.destaque, a.nome, a.serie_escolar, g.nome, t.nome, e.numero, e.titulo;

CREATE VIEW vw_estatisticas_autor AS
SELECT
    a.id,
    a.nome,
    a.serie_escolar,
    COUNT(p.id)                  AS total_publicacoes,
    SUM(p.visualizacoes)         AS total_visualizacoes,
    AVG(p.visualizacoes)         AS media_visualizacoes,
    COUNT(DISTINCT p.edicao_id)  AS edicoes_participadas
FROM autor a
LEFT JOIN publicacao p ON a.id = p.autor_id
GROUP BY a.id, a.nome, a.serie_escolar;

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
INNER JOIN autor a            ON p.autor_id          = a.id
INNER JOIN generos g          ON p.genero_id          = g.id
INNER JOIN temas_principais t ON p.tema_principal_id = t.id
WHERE p.data_publicacao IS NOT NULL
ORDER BY p.data_publicacao DESC
LIMIT 10;

-- ============================================================
-- DADOS: DOMÍNIO
-- ============================================================

INSERT INTO generos (nome, descricao) VALUES
    ('Editorial',                 'Texto que expressa a opinião oficial do jornal'),
    ('Charge',                    'Ilustração satírica com crítica social ou política'),
    ('Crônica',                   'Texto narrativo curto sobre fatos cotidianos'),
    ('Manifesto',                 'Declaração pública de princípios e intenções'),
    ('Carta Aberta',              'Mensagem dirigida a alguém mas de interesse público'),
    ('Resenha/Síntese',           'Análise crítica de obra, evento ou tema'),
    ('Diário/Depoimento Pessoal', 'Relato em primeira pessoa de experiências'),
    ('Reportagem',                'Texto jornalístico investigativo e aprofundado'),
    ('Artigo de Opinião',         'Texto argumentativo com ponto de vista do autor'),
    ('Artigo Científico',         'Texto acadêmico com rigor metodológico'),
    ('Nota de Esclarecimento',    'Comunicado oficial sobre fato ou boato'),
    ('Entrevista',                'Conversa com personalidade sobre tema relevante'),
    ('Informativo Institucional', 'Comunicação oficial da instituição'),
    ('Desenho',                   'Ilustração artística'),
    ('Tirinha',                   'História em quadrinhos curta'),
    ('Palavra-Cruzada',           'Jogo de palavras');

INSERT INTO temas_principais (nome, descricao) VALUES
    ('Conflitos Bélicos',            'Guerras, tensões internacionais e questões militares'),
    ('Legislações Atuais',           'Leis, projetos de lei e mudanças jurídicas'),
    ('Avanço Tecnológico',           'Inovações tecnológicas e impactos sociais'),
    ('Violência e Segurança Pública','Criminalidade, policiamento e justiça'),
    ('Meio Ambiente',                'Questões ecológicas e sustentabilidade'),
    ('Eleições',                     'Processos eleitorais e política partidária'),
    ('Saúde',                        'Questões médicas e de saúde pública'),
    ('Ciência',                      'Pesquisas científicas e descobertas'),
    ('Vício em Jogos de Azar',       'Dependência e regulação de apostas');

INSERT INTO categorias (sigla, nome, descricao) VALUES
    ('CB',  'Conflitos Bélicos',    'Soberania nacional, liberdade de expressão, polarização política'),
    ('LA',  'Legislações Atuais',   'Lei anti-misoginia, Lei Felca, PL da escala 6x1, etc'),
    ('AT',  'Avanço Tecnológico',   'Produção de jatos, IA, impactos tecnológicos'),
    ('VSP', 'Violência e Segurança','Ação policial, racismo, machosfera, justiça social'),
    ('MA',  'Meio Ambiente',        'Desastres climáticos, agronegócio, recursos hídricos'),
    ('EL',  'Eleições',             'Representatividade política, polarização, fake news'),
    ('SA',  'Saúde',                'Medicalização, transtornos mentais, saúde mental'),
    ('CI',  'Ciência',              'Descredibilização, cortes orçamentários, profissionalização'),
    ('VJA', 'Vício em Jogos',       'Apostas infantis e dependência');

INSERT INTO status_edicao (nome) VALUES
    ('Rascunho'), ('Em Revisão'), ('Pronta'), ('Publicada'), ('Arquivada');

INSERT INTO status_comentario (nome) VALUES
    ('Pendente'), ('Aprovado'), ('Rejeitado'), ('Spam');

-- ============================================================
-- DADOS: AUTORES (3ºB)
-- ============================================================

INSERT INTO autor (id, nome, serie_escolar, email) VALUES
( 1, 'Adrian Clarck',     '3ºB', 'adrian.clarck@portalsesisp.org.br'),
( 2, 'Andrew Clarck',     '3ºB', 'andrew.clarck@portalsesisp.org.br'),
( 3, 'Eduardo Chaves',    '3ºB', 'eduardo.chaves4@portalsesisp.org.br'),
( 4, 'Enzo Araujo',       '3ºB', 'enzo.araujo4@portalsesisp.org.br'),
( 5, 'Felipe Paiva',      '3ºB', 'felipe.paiva@portalsesisp.org.br'),
( 6, 'Fernando Santos',   '3ºB', 'fernando.santos127@senaisp.edu.br'),
( 7, 'Giovana Fonseca',   '3ºB', 'giovana.fonseca2@portalsesisp.org.br'),
( 8, 'Gustavo Francisco', '3ºB', 'gustavo.francisco6@portalsesisp.org.br'),
( 9, 'Heloisa Paixao',    '3ºB', 'heloisa.paixao@portalsesisp.org.br'),
(10, 'Joao Goncalves',    '3ºB', 'joao.goncalves28@portalsesisp.org.br'),
(11, 'Jose Armelin',      '3ºB', 'jose.armelin@portalsesisp.org.br'),
(12, 'Laisla Tararan',    '3ºB', 'laisla.tararan@portalsesisp.org.br'),
(13, 'Leticia Caristo',   '3ºB', 'leticia.caristo@portalsesisp.org.br'),
(14, 'Leticia Souto',     '3ºB', 'leticia.souto3@portalsesisp.org.br'),
(15, 'Luiz Gaspar',       '3ºB', 'luiz.gaspar@portalsesisp.org.br'),
(16, 'Maria Quidiquimo',  '3ºB', 'maria.quidiquimo@portalsesisp.org.br'),
(17, 'Matheus Felippe',   '3ºB', 'matheus.felippe3@portalsesisp.org.br'),
(18, 'Miguel Oliveira',   '3ºB', 'miguel.oliveira10@portalsesisp.org.br'),
(19, 'Monica Manfrinato', '3ºB', 'monica.manfrinato@portalsesisp.org.br'),
(20, 'Monique Fonseca',   '3ºB', 'monique.fonseca@portalsesisp.org.br'),
(21, 'Paula Gianotto',    '3ºB', 'paula.gianotto@portalsesisp.org.br'),
(22, 'Pedro Jimenez',     '3ºB', 'pedro.jimenez@portalsesisp.org.br'),
(23, 'Pedro Silva',       '3ºB', 'pedro.silva342@portalsesisp.org.br'),
(24, 'Rafael Silva',      '3ºB', 'rafael.silva158@portalsesisp.org.br'),
(25, 'Ricardo Cruz',      '3ºB', 'ricardo.cruz@portalsesisp.org.br'),
(26, 'Sarah Antonio',     '3ºB', 'sarah.antonio@portalsesisp.org.br');

-- ============================================================
-- DADOS: PUBLICAÇÕES
-- ============================================================

INSERT INTO publicacao (titulo, conteudo, resumo, data_criacao, data_publicacao, autor_id, genero_id, tema_principal_id) VALUES

('A Diplomacia Pacifista do Brasil',
'Caros estudantes, Vamos falar um pouco sobre a diplomacia do nosso país. Afinal, vocês sabem por que ela é tão respeitada internacionalmente? O Brasil se tornou uma referência por seguir uma tradição pacifista, baseada no diálogo e na busca pela paz entre as nações. Ao longo da história, nosso país procurou resolver conflitos por meio de acrobatacias e negociações, evitando confrontos diretos. Um exemplo disso ocorreu quando o governo de Donald Trump impôs ameaças econômicas a outros países. Mesmo diante dessas tensões internacionais, o Brasil manteve uma postura diplomática e buscou soluções formais e pacíficas, sem recorrer a ameaças ou violência. Além disso, manter a neutralidade ajuda o país a preservar relações comerciais e evitar prejuízos econômicos. Dessa forma, o Brasil consegue dialogar com diferentes nações sem favorecer conflitos ou interesses externos. E como um país poderia mediar guerras sem possuir respeito internacional? O Brasil possui autoridade moral justamente por defender o diálogo acima da violência. Nossa diplomacia busca cooperação, equilíbrio e entendimento entre os povos. Caros estudantes, a paz não demonstra fraqueza, mas sabedoria. Que o Brasil continue sendo exemplo de equilíbrio, respeito e união entre as nações. Muito obrigado.',
'O Brasil se tornou uma referência por seguir uma tradição pacifista baseada no diálogo.',
'2026-05-28', '2026-05-28', 1, 9, 1), -- Artigo de Opinião | Conflitos Bélicos

('Carta aberta ao Itamaraty acerca da soberania brasileira',
'Prezado Itamaraty, Nós, estudantes de Relações Internacionais, viemos a público expressar nossa visão acerca do posicionamento do país diante da escalada de conflitos no exterior. O Brasil, historicamente, adota uma postura de não intervenção in fóruns internacionais, mesmo diante de crises humanitárias, como observado nas atuais guerras da Ucrânia e do Irã, nas quais o país se mantém neutro e não implementa intervenções, limitando-se a discursos puramente estéticos, que pouco contribuem para a situação em questão. Apesar de esperado, consideramos esse posicionamento inaceitável e defendemos uma postura mais assertiva perante situações humanitárias, para que não haja questionamentos sobre nossa ética e empatia, além de fortalecer nossa soberania nacional e reforçar as raízes diplomáticas da nação. Além disso, com uma postura diplomática mais assertiva, a influência brasileira seria fortalecida em organismos internacionais, permitindo uma maior participação em decisões globais e consolidando uma imagem de liderança. Ademais, isso também traria benefícios econômicos, pois abriria possibilidades para acordos financeiros com diversas nações, incluindo rivais, como os EUA e a China. Desse modo, sugerimos que o Itamaraty amplie a participação em negociações multilaterais, fortaleça alianças estratégicas e intensifique ações humanitárias por meio do envio de suprimentos em contextos de crise, do acolhimento de refugiados e da participação ativa na ONU e em outros fóruns, apresentando propostas de intervenção que visem apoiar populações em situação de calamidade. Assim, o Brasil reafirma sua soberania sem adotar ações isolacionistas, mantendo sua tradição de diálogo e busca pela paz. Atenciosamente, Estudantes de Relações Internacionais',
'Estudantes sugerem ações diplomáticas que reforcem a soberania sem isolacionismo.',
'2026-05-28', '2026-05-28', 2, 5, 1), -- Carta Aberta | Conflitos Bélicos

('Acerto de contas com o passado',
'Prezado leitores e colegas, nesta edição abordamos um assunto fundamental para a estrutura da nossa sociedade: as políticas de cotas e a necessidade de reparação. Para compreender essa urgência, devemos confrontar nossa dívida histórica. No Brasil, a abolição da escravidão, in 1888, não foi seguida de medidas de inclusão; pelo contrário, a população negra foi relegada à marginalização, sem acesso a terras ou educação. Esse abismo secular demonstra que o ponto de partida da corrida social brasileira nunca foi igual para todos. Diante desse cenário, é essencial desfazer o mito de que as cotas são privilégios, uma vez que, na verdade, são instrumentos de reparação econômica. Primeiramente, elas buscam neutralizar o bônus hereditário de quem acumulou riquezas e educação ao longo de gerações, enquanto outros foram legalmente impedidos de fazê-lo, atuando como um nivelamento de um terreno historicamente desigual. Ademais, ao incluir grupos marginalizados em posições de decisão, o Estado fomenta o desenvolvimento educacional e oferece oportunidades que independem da origem familiar, rompendo o ciclo da pobreza e gerando benefícios financeiros e intelectuais para o país como um todo, além de diminuir os custos sociais associados à desigualdade. Com o propósito de reflexão, convido todos a pensarem sobre sua própria trajetória e posição social. Quais oportunidades surgiram para você antes mesmo de buscá-las? Quanto do seu desenvolvimento foi impulsionado por um ambiente familiar ou financeiro favorável? O primeiro passo para compreender que a verdadeira justiça exige tratar de forma diferente os desiguais é reconhecer que nem todos partiram do mesmo ponto. Mais do que reconhecer privilégios, é entender que a estrutura social brasileira foi construída sobre profundas desigualdades históricas, especialmente raciais, cujos efeitos ainda permanecem presentes no acesso à educação, ao mercado de trabalho e aos espaços de poder. Boa Leitura! O editor.',
'Editorial sobre cotas raciais como ferramenta de reparação histórica e econômica.',
'2026-05-28', '2026-05-28', 3, 1, 4), -- Editorial | Violência e Segurança Pública

('Denúncia de interrupções de aulas',
'Prezados secretários, Como moradora de comunidade da nossa cidade, venho por meio desta denunciar situações de interrupções de aulas devido a operações policiais, ocorrências que se tornaram frequentes e que provocam pânico e traumas em nossos alunos de comunidade. Ademais devo ressaltar a experiência traumática que é estar em meio a um tiroteio, ainda mais para uma criança com a mente em desenvolvimento constante, ou até mesmo um jovem, cenários que não podem acontecer perto dessas crianças e jovens, pois podem fazê-las desenvolver síndromes muito cedo prejudicando o resto de suas vidas. É necessário colocar em pauta os futuros problemas que os alunos das escolas afetadas podem enfrentar, mais precisamente a evasão escolar, cenário em que os estudantes deixam a escola cedo demais para evitar essas operações, muitas vezes caindo na vida do crime, ou quando não é isso acontece a falta de escolaridade para esses jovens e crianças afetados, resultando numa dificuldade enorme para empregabilidade ou o caso em que eles se sujeitam a trabalhos precários. Por fim, viso uma revisão clara e objetiva acerca dos protocolos policiais em perímetro escolar, e nós das comunidades sabemos que vocês podem agir por meios para tornar as ações menos nocivas. Peço que conscientizem seus profissionais para que situações como essa sejam evitadas e o futuro das nossas crianças seja protegido. Atenciosamente, uma periférica.',
'Denúncia sobre o impacto das operações policiais no cotidiano e na saúde mental de estudantes periféricos.',
'2026-05-28', '2026-05-28', 4, 7, 4), -- Diário/Depoimento | Violência e Segurança Pública

('Discurso contra a escala 6x1',
'Boa noite, caros, moradores. Digam-me: quem aqui não trabalha todos os dias, fora ou dentro do lar? E quem aqui não tem uma família te esperando em casa? Nós trabalhadores vivemos na exaustão, chegando em casa tarde e acordando cedo. Hoje para muitos de nós viver momentos de qualidade com os nossos filhos é um luxo, filhos esses que muitas vezes sentem que foram abandonados pelos seus pais, e nós não vivemos, apenas sobrevivemos para vestir a eles. Ou seja, por causa desse sistema desumano da escala 6x1, nossas casas se tornaram lugares de passagem e nossos filhos crescem sem que possamos perceber. Tempo não é só dinheiro, e é no tempo livre que construímos as relações, sem o qual não podemos conviver com filhos e amigos, ou seja somos impedidos de ensinar nossos valores e fortalecer a família e nossa afetividade. Lembrem-se, descansar em casa não é luxo, muito menos viver com a nossa família, essas coisas são necessidades, um direito constitucional, e sem elas tanto o corpo quanto a mente se esgotam. Isso que diz o movimento VAT (Vida Além do Trabalho), que reforça a existência de experiencias que devem ser além da profissional, e é nessa vida que devemos nos apegar, pois é nela que formamos a nossa base familiar, não no trabalho. Por isso digo, nós, como trabalhadores e pais, não podemos aceitar a precarização do trabalho dessa forma. Nós, enquanto maioria precisamos pressionar nossos parlamentares para que eles, como servidores públicos compreendam a nossa dor e criem leis que garantam condições dignas e tempo de vida além do trabalho. Afinal, precisamos trabalhar sim para sobrevivir, mas uma sociedade doente não avança em nenhum aspecto, seja ele econômico, político ou social. Temos o direito de "Trabalhar para viver" e não "Viver para trabalhar".',
'Discurso de líder comunitário contra a exaustão da escala 6x1.',
'2026-05-28', '2026-05-28', 5, 9, 2), -- Artigo de Opinião | Legislações Atuais

('Diversidade Étnica gera Inovação',
'Olhem ao redor, quantos de nós realmente nos sentimos representados nos espaços de liderança? Quantos profissionais negros chegam todos os dias preparados e competentes, mas ainda encontram barreiras para crescer dentro das empresas? Estamos aqui hoje porque a sub-representação racial em cargos de liderança virou um problem real e sério no nosso dia a dia. Vivemos em um mercado acelerado, cheio de cobranças, metas e busca por resultados. Mas até quando as empresas vão ignorar talentos apenas pela cor da pele? A diversidade étnica gera inovação, porque diferentes experiências trazem novas ideias, soluções mais criativas e ajudam as empresas a entender melhor a sociedade. Não somos todos iguais, e justamente essa diferença fortalece o ambiente de trabalho. Ignorar a falta de diversidade tem consequências sérias. As desigualdades aumentam, muitos profissionais continuam sem oportunidades e a economia perde talentos importantes. Por outro lado, quando há inclusão e justiça econômica, mais pessoas conseguem crescer, trabalhar com dignidade e contribuir para o desenvolvimento das empresas e da sociedade. Então eu pergunto a vocês vale a pena crescer às custas da exclusão? Vamos agir agora antes que seja tarde.',
'Discurso sobre a importância da diversidade racial em cargos de liderança.',
'2026-05-28', '2026-05-28', 6, 9, 4), -- Artigo de Opinião | Violência e Segurança Pública

('Mãe Solo na Escala 6x1',
'Desde pequena eu sonhava com o meu futuro e planejava como eu seria, era um sonho leve, eu brincava com as minhas bonecas já imaginando as alegrias que viveria com meus filhos. Hoje, vejo que essa era uma ilusão de criança. Ser mãe solo é pesado e a rotina dura transformou meu desejo de ter uma carreira em uma luta diária pela sobrevivência dos meus filhos e pela minha. O que eu relato aqui não é só um desabafo, é um apelo sobre a dificuldade de exercer a maternidade nessas condições. Chego em casa depois de longas horas na fábrica e percebo que liberdade e tempo são apenas palavras de dicionário, porque nunca as tenho. Trabalho na escala 6x1 e sinto que essa jornada tripla só piora, sou CLT o dia todo e à noite contínuo o serviço em casa. O primeiro motivo que me impede de ser mãe plenamente é a falta de presença, chego e só vejo meus pequenos dormindo, perco as apresentações e os momentos que não voltam mais. O sistema me quer como peça de fábrica, mas meus filhos precisam de uma mãe por perto. O segundo ponto é o esgotamento, eu não consigo ser a mãe que eu queria ser porque o cansaço tira minhas forças, para ser mãe, é preciso paciência e energia, mas como ter isso trabalhando seis dias por semana? O domingo acaba sendo meu único dia com eles, onde tento ser "pessoa" e mãe ao mesmo tempo, mas o medo de não aguentar esse ritmo é constante, sou o pilar da vida deles e não posso faltar. Por tudo isso, sinto que precisamos urgente de políticas públicas que protejam o nosso tempo de convívio social, não é justo viver apenas para trabalhar. Reduzir a carga horária ou repensar essa escala 6x1 é necessário para que a gente tenha o direito de criar nossos filhos com dignidade e saúde, e não apenas sobreviver',
'Depoimento emocionante sobre os desafios da maternidade solo sob a escala 6x1.',
'2026-05-28', '2026-05-28', 7, 7, 2), -- Diário/Depoimento | Legislações Atuais

('Investimento Público na Educação',
'Visto que o investimento do governo em ações públicas é direito da sociedade, e não uma opção que pode ser ignorado, nós, membros de um movimento estudantil, exigimos o uso do dinheiro público para a melhora na qualidade do ensino nas escolas. Há anos estamos sofrendo com cortes orçamentários na educação, o que está prejudicando o acesso aos estudos, fazendo assim, pessoas sem muitas opções, escolherem a criminalidade ou sub-empregos, ao invés da formação acadêmica ou profissional. Esses cortes restringem não só pessoas com pouca condição financeira, mas também os deficientes, como cadeirantes que sofrem com problemas com o acesso aos ambientes de ensino. Este cenário difícil força as pessoas a seguirem caminhos precarizados ou ilegais. Sabe-se que o aumento dos gastos com emendas parlamentares foi o causador della redução das verbas de manutenção e assistência estudantil (bolsas, moradia, alimentação) nas universidades federais, o que por sua vez, gerou grandes consequências na vida dos estudantes, como foi citado acima. Basta desse descaso com a educação de qualidade. Está na hora de algo ser feito em prol do futuro de nosso país. Por esse motivo, nós convocamos a população, que é a maior prejudicada pelo uso incorreto do orçamento público, a irem para as ruas, realizarem protestos e grandes movimentações em busca do acesso a um ensino de qualidade para todos os estudantes. Não aceitaremos mais esses problemas, e lutaremos até que a economia não tenha como foco principal a manutenção dos privilégios dos políticos e daqueles de maior poder, mas sim a melhora na inclusão e na formação de cada aluno, que merece um ensino de qualidade. Lider do movimento estudantil',
'Manifesto contra os cortes de verbas na educação e defesa do orçamento público.',
'2026-05-28', '2026-05-28', 8, 4, 2), -- Manifesto | Legislações Atuais

('A Tirania dos Filtros',
'Queridos estudantes, Vivemos hoje em uma sociedade na qual se acredita que há uma vida perfeita de trás das telas, porém, venho para expor a vocês que isso não é real! Como influenciadora, afirmo que muitos usam máscaras e filtros que os impedem de ser eles mesmo e aceitarem suas falhas morais e as imperfeições físicas. Essa procura pela perfeição nos tem feito adoecer! Já pararam para pensar nisso? Em primeiro lugar, precisamos entender a "tirania dos filtros". Nas redes, sociais, vemos rostos perfeitos, corpos considerados ideais e recortes de vida e realidade aparentemente perfeitas. Quantos de nós já nos sentimos inferiores as pessoas das redes por terem os melhores carros, casas, namorados, vidas? Mas, a verdade é que essas coisas não são reais. São imagens editadas, escolhidas "a dedo" e muito distantes da realidade. Esse padrão inalcançável pode fazer com que muitos de nós nos sintamos insuficientes, gerando inseguranças horríveis. Além disso, existe a constante busca por validação através de curtidas, comentários e republicações. Já passou por aquela situação em que, ao postar uma foto, as curtidas não sobem instantaneamente? Quando uma publicação não recebe tanta atenção, assim como o esperado, infelizmente é comum surgirem sentimento de frustração e rejeição. Isso faz com que a autoestima passe a depender da aprovação alheia, mesmo sabendo que o algoritmo é cruel com aqueles que não se encaixam no padrão, o que é extremamente prejudicial para o bem-estar emocional, onde os valores estão intimamente associados à quantas curtidas e repercussão conseguimos ao nos expor. Por isso, eu convido a todos vocês a pensarem: será que vale a pena se comparar com algo que nem é real? Vamos tentar, aos poucos, nos desconectar dessa pressão constante. Valorizar quem somos de verdade, praticar a autocompaixão para entendermos que não precisamos ser perfeitos para sermos suficientes. Não nos cobremos e comparemos tanto. E, principalmente, não se esqueçam: a vida real é muito mais bonita do que qualquer tela. Muito obrigada, pessoal! Fiquem bem',
'Discurso de influenciadora sobre os riscos da perfeição digital nas redes sociais.',
'2026-05-28', '2026-05-28', 9, 9, 3), -- Artigo de Opinião | Avanço Tecnológico

('O Sistema Carcerário Brasileiro',
'Muitas pessoas acreditam que a construção de presídios resolverá os problemas de criminalidade no nosso país, porém, não é assim que eu, ex-gerente penitenciário acredito. Os acontecimentos que irei narrar evidenciam como o problema é bem mais complexo e desafiador do que muitos imaginam. Até hoje eu consigo me lembrar dos casos de violência, da escassez dos processos de higienização e da negligência com o espaço individual das pessoas que ocupam o ambiente carcerário brasileiro. Celas e presídios superlotados e situações de desumanização são recurrentes nesses espaços. Pensando nisso, me ocorre a lembrança de uma mulher sentada no chão de uma cela. Ela não chorava, não transmitia no rosto nem tristeza nem raiva, era possível sentir apenas uma desesperança de que se tornaria humana novamente. Foi transformada em animal pelo Estado e assim seria até sua morte. Em todo dia de trabalho no presídio havia uma mesma notícia: violência física ou assassinatos entre os presidiários ou praticados pelas autoridades desses lugares. A violência simbólica, estrutura precarizada e a superlotação fomentam esses acontecimentos. É incrível como isso é comum e não se tomam providências sobre essas situações. Trabalhando em um presídio no Brasil, eu percebi o quanto precisamos melhorar. Pessoas presas injustamente como a mulher que citei, as mortes, crimes e desumanizações ocorridos nesses espaços revelam como o meio usado para a reabilitação de pessoas é ineficaz. Sob este viés, é necessário arrancar o mal pela raiz, cultivando educação e cultura de qualidade, além de ações para tornar o ambiente educativo mais respeitoso, seguro e acessível para a realidade da população marginalizada brasileira, que representa uma enorme parte das pessoas presas. Assim, com o alívio da lotação, medidas educativas, filantrópicas e filosóficas devem ser tomadas a fim de formar pessoas que futuramente, poderão se ajustar à sociedade em que habitam.',
'Depoimento de ex-agente penitenciário sobre a ineficácia do sistema atual.',
'2026-05-28', '2026-05-28', 10, 7, 4), -- Diário/Depoimento | Violência e Segurança Pública

('Golpe de Voz Clonada',
'Eu sofri um golpe de voz clonada e é pior do que parece. À primeira vista parece algo difícil de cair, mas quando acontece, você nem percebe. Um número desconhecido ligou para mim, e com minhas respostas, minha voz foi clonada. Quando atendi, ouvi uma voz parecida com a de meu filho, era tão parecida que até o modo de falar e o tom de preocupação eram parecidos. Ele disse que estava em perigo e que precisava de um dinheiro urgente. Na hora me veio o desespero e nem pensei duas vezes em fazer a transferência, apenas queria ajudar. Minutos depois, recebi uma mensagem de meu filho verdadeiro, completamente tranquilo. Foi aí que a ficha caiu. Eu tinha sido enganado por uma pessoa que nunca vi, e nunca verei em minha vida. Não era só um golpe comum, era algo muito mais sofisticado. O prejuízo financeiro foi grande, mas o impacto emocional foi ainda pior. Hoje, eu aprendi que nem tudo que é familiar é verdadeiro. E que, mesmo em situações de urgência, parar e confirmar pode fazer a diferença. Depois de cair em um golpe de voz clonada, percebi como os alertas sobre medidas de segurança são importantes e precisam ser levados a sério.',
'Relato pessoal sobre um golpe de engenharia social com clonagem de voz por IA.',
'2026-05-28', '2026-05-28', 11, 7, 3); -- Diário/Depoimento | Avanço Tecnológico

-- ============================================================

SET FOREIGN_KEY_CHECKS = 1;

-- Verificação final
SELECT COUNT(*) AS total_generos     FROM generos;
SELECT COUNT(*) AS total_temas       FROM temas_principais;
SELECT COUNT(*) AS total_autores     FROM autor;
SELECT COUNT(*) AS total_publicacoes FROM publicacao;