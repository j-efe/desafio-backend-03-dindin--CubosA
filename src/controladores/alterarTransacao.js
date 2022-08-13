const conexao = require('../conexao');


const alterarTransacao = async (req, res) => {

    const { descricao, valor, data, categoria_id, tipo } = req.body
    if (tipo.toUpperCase() !== "ENTRADA" & tipo.toUpperCase() !== "SAIDA") {
        return res.status(400).json(`O campo tipo deverá ser preenchido com "entrada" ou "saída"`);
    }
    if (!descricao) {
        return res.status(400).json({ "mensagem": "O campo descricao é obrigatório." });
    }
    if (!valor) {
        return res.status(400).json({ "mensagem": "O campo valor é obrigatório." });
    }
    if (!data) {
        return res.status(400).json({ "mensagem": "O campo data é obrigatório." });
    }
    if (!categoria_id) {
        return res.status(400).json({ "mensagem": "O campo categoria_id é obrigatório." });
    }
    if (!tipo) {
        return res.status(400).json({ "mensagem": "O campo tipo é obrigatório." });
    }

    const { id } = req.usuario
    const { id: idTransacao } = req.params
    try {
        const queryF = "SELECT * FROM transacoes WHERE usuario_id = $1 AND id = $2"
        const { rowCount } = await conexao.query(queryF, [id, idTransacao])
        if (rowCount === 0) {
            return res.status(404).json({ "mensagem": "Nenhuma transação foi cadastrada sob este id para este login" })
        }

    } catch (error) {
        return res.status(400).json(error.message)
    }


    try {
        const { rowCount } = await conexao.query("SELECT * FROM categorias WHERE id = $1", [categoria_id])
        if (rowCount === 0) {
            return res.status(404).json({ "mensagem": "Categoria não encontrada" })
        }
    } catch (error) {
        return res.status(400).json(error.message)
    }

    try {
        const { id } = req.params
        const query = `
        UPDATE transacoes 
        SET descricao = $1, valor = $2, data = $3, categoria_id = $4, tipo = $5
        WHERE id = $6`
        const dadosOperacao = await conexao.query(query, [descricao, valor, data, categoria_id, tipo.toLowerCase(), id])
        if (dadosOperacao.rowCount === 0) {
            return res.status(400).json({ "mensagem": "Falha atualização" })
        }
        return res.status(200).json()
    } catch (error) {
        return res.status(400).json(error.message)
    }

}






module.exports = {
    alterarTransacao
}