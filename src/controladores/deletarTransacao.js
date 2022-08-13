const conexao = require('../conexao');


const deletarTransacao = async (req, res) => {

    const { id } = req.usuario
    const { id: idTransacao } = req.params
    try {
        const queryF = "SELECT * FROM transacoes WHERE usuario_id = $1 AND id = $2"
        const { rowCount } = await conexao.query(queryF, [id, idTransacao])
        if (rowCount === 0) {
            return res.status(403).json({ mensagem: "Nenhuma transação foi cadastrada sob este id para este login" })
        }

    } catch (error) {
        return res.status(400).json(error.message)
    }

    try {
        const query = `
        DELETE FROM transacoes WHERE id = $1`
        const dadosOperacao = await conexao.query(query, [idTransacao])
        if (dadosOperacao.rowCount === 0) {
            return res.status(400).json({ mensagem: "Falha na exclusão" })
        }
        return res.status(200).json()
    } catch (error) {
        return res.status(400).json(error.message)
    }

}






module.exports = {
    deletarTransacao
}