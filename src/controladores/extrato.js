const conexao = require("../conexao")

const extrato = async (req, res) => {
    const { id } = req.usuario

    try {
        const query = `SELECT tipo, SUM(valor) FROM transacoes 
        WHERE usuario_id = $1
        GROUP BY tipo`
        const { rows } = await conexao.query(query, [id])
        const final = {
            entrada: 0,
            saida: 0
        }
        const indexEntrada = rows.findIndex((element) => {
            return element.tipo === "entrada"
        })
        const indexSaida = rows.findIndex((element) => {
            return element.tipo === "saida"
        })
        indexEntrada !== -1 ? final.entrada = rows[indexEntrada].sum : final.entrada
        indexSaida !== -1 ? final.saida = rows[indexSaida].sum : final.saida

        return res.status(200).json(final)
    } catch (error) {
        res.status(400).json(error.message)
    }
}

module.exports = {
    extrato
}