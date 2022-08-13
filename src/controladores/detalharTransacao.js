const conexao = require('../conexao');



const detalharTransacao = async (req, res) => {
    const { id } = req.usuario
    const { id: idTransacao } = req.params
    try {
        const query = `SELECT
        transacoes.id, transacoes.tipo, transacoes.descricao, transacoes.valor, transacoes.data, transacoes.usuario_id, 
        categoria_id, categorias.descricao AS "categoria_nome"
        FROM transacoes
        JOIN categorias ON categorias.id = transacoes.categoria_id
         WHERE usuario_id = $1 AND transacoes.id = $2   
         `
        const { rows, rowCount } = await conexao.query(query, [id, idTransacao])
        if (rowCount === 0) {
            return res.status(400).json({ mensagem: "Transação não encontrada." })
        }
        return res.status(200).json(rows)
    } catch (error) {
        return res.status(400).json(error.message)
    }

}




module.exports = { detalharTransacao }