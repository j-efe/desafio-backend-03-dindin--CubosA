const conexao = require('../conexao');



const detalharUsuario = async (req, res) => {

    const { id } = req.usuario

    try {
        const { rowCount } = await conexao.query("SELECT * FROM usuarios WHERE id = $1", [id])
        return rowCount > 0 ? res.status(200).json(req.usuario) : res.status(400).json({ "mensagem": "Para acessar este recurso um token de autenticação válido deve ser enviado." })
    } catch (error) {
        res.status(404).json(error.message)
    }

}




module.exports = { detalharUsuario }