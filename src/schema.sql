DROP TABLE IF EXISTS transacoes;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS categorias;


CREATE TABLE usuarios(
  id serial primary key,
  nome text not null,
  email text not null unique,
  senha text not null);
  

CREATE TABLE categorias (
  id serial primary key,
  descricao text not null unique);
  
CREATE TABLE transacoes (
  id serial primary key,
  descricao text not null,
  valor int not null,
  "data" date default now(),
  categoria_id smallint references categorias(id),
  usuario_id smallint references usuarios(id),
  tipo text not null);
  
INSERT INTO categorias (descricao)
VALUES
('Alimentação'),
('Assinaturas e Serviços'),
('Casa'),
('Mercado'),
('Cuidados Pessoais'),
('Educação'),
('Família'),
('Lazer'),
('Pets'),
('Presentes'),
('Roupas'),
('Saúde'),
('Transporte'),
('Salário'),
('Vendas'),
('Outras receitas'),
('Outras despesas');