const conexao = require('./conexao.js');
const jwt = require("jsonwebtoken")
const jwtSecret = require("./jwt_secret")


const verificarToken = async (req, res, next) => {
    const { authorization } = req.headers
    if (!authorization) {
        return res.status(404).json({ "mensagem": "Para acessar este recurso um token de autenticação válido deve ser enviado." })
    }

    try {
        const token = authorization.replace("Bearer", "").trim();
        const { id } = await jwt.verify(token, jwtSecret)

        const query = "SELECT * FROM usuarios WHERE id = $1";
        const { rows, rowCount } = await conexao.query(query, [id])
        if (rowCount === 0) {
            return res.status(400).json({ "mensagem": "Para acessar este recurso um token de autenticação válido deve ser enviado." })
        }

        const { senha, ...usuario } = rows[0]
        req.usuario = usuario
        next()

    } catch (error) {
        return res.status(400).json(error.message);
    }
}


module.exports = { verificarToken }