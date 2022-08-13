const conexao = require('../conexao');


const cadastrarTransacao = async (req, res) => {

    const { id } = req.usuario

    const { descricao, valor, data, categoria_id, tipo } = req.body
    if (tipo.toUpperCase() !== "ENTRADA" & tipo.toUpperCase() !== "SAIDA") {
        return res.status(400).json("O campo tipo deverá ser preenchido com entrada ou saída");
    }
    if (!descricao) {
        return res.status(400).json("O campo descricao é obrigatório.");
    }
    if (!valor) {
        return res.status(400).json("O campo valor é obrigatório.");
    }
    if (!data) {
        return res.status(400).json("O campo data é obrigatório.");
    }
    if (!categoria_id) {
        return res.status(400).json("O campo categoria_id é obrigatório.");
    }
    if (!tipo) {
        return res.status(400).json("O campo tipo é obrigatório.");
    }

    try {
        const { rowCount } = await conexao.query("SELECT * FROM categorias WHERE id = $1", [categoria_id]);
        if (rowCount === 0) {
            return res.status(400).json("Categoria não encontrada")
        }
    } catch (error) {
        return res.status(400).json(rowCount)
    }

    try {
        const query = `
        INSERT INTO transacoes (descricao, valor, data, categoria_id, usuario_id, tipo)
        VALUES
        ($1,$2,$3,$4,$5,$6)`
        const dadosOperacao = await conexao.query(query, [descricao, valor, data, categoria_id, id, tipo.toLowerCase()])
        if (dadosOperacao.rowCount === 0) {
            return res.status(400).json("Falha no cadastro da operação")
        }

    } catch (error) {
        return res.status(400).json(error.message)
    }

    try {
        const queryF = "SELECT * FROM transacoes WHERE usuario_id = $1 ORDER BY id DESC LIMIT 1"
        const { rows } = await conexao.query(queryF, [id])
        return res.status(200).json(rows[0])
    } catch (error) {
        return res.status(400).json(error.message)
    }
}






module.exports = {
    cadastrarTransacao
}