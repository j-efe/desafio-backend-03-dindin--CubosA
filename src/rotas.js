const express = require("express")
const rotas = express()
const { cadastrarUsuarios } = require("./controladores/cadastrarUsuarios")
const { login } = require("./controladores/logarUsuario")
const { cadastrarTransacao } = require("./controladores/cadastrarTransacao")
const { verificarToken } = require("./verificarToken")
const { detalharUsuario } = require("./controladores/detalharUsuario")
const { listarCategorias } = require("./controladores/listarCategorias")
const { alterarUsuario } = require("./controladores/alterarUsuario")
const { listarTransacoes } = require("./controladores/listarTransacoes")
const { detalharTransacao } = require("./controladores/detalharTransacao")
const { alterarTransacao } = require("./controladores/alterarTransacao")
const { deletarTransacao } = require("./controladores/deletarTransacao")
const { extrato } = require("./controladores/extrato")


rotas.post('/usuario', cadastrarUsuarios)
rotas.post('/login', login)



rotas.use(verificarToken)

rotas.get("/usuario", detalharUsuario)
rotas.get("/categoria", listarCategorias)
rotas.put("/usuario", alterarUsuario)
rotas.post("/transacao", cadastrarTransacao)
rotas.get("/transacao", listarTransacoes)
rotas.put("/transacao/:id", alterarTransacao)
rotas.delete("/transacao/:id", deletarTransacao)
rotas.post("/usuario", cadastrarUsuarios)
rotas.get("/transacao/extrato", extrato)
rotas.get("/transacao/:id", detalharTransacao)


module.exports = rotas