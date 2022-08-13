const conexao = require('../conexao');



const listarCategorias = async (req, res) => {

    try {
        const { rowCount, rows } = await conexao.query("SELECT * FROM categorias")
        return rowCount > 0 ? res.status(200).json(rows) : res.status(400).json({ "mensagem": "Para acessar este recurso um token de autenticação válido deve ser enviado." })
    } catch (error) {
        res.status(400).json(error.message)
    }

}




module.exports = { listarCategorias }