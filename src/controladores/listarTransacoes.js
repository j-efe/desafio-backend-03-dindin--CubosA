const conexao = require('../conexao');




const listarTransacoes = async (req, res) => {
    const { id } = req.usuario
    const filtro = req.query.filtro
    const filtroTratado = []
    const idsDoFiltro = []
    const final = [];
    if (!filtro) {

        try {
            const query = `SELECT
        transacoes.id, transacoes.tipo, transacoes.descricao, transacoes.valor, transacoes.data, transacoes.usuario_id, 
        categoria_id, categorias.descricao AS "categoria_nome"
        FROM transacoes
        JOIN categorias ON categorias.id = transacoes.categoria_id
         WHERE usuario_id = $1 
         `
            const { rows } = await conexao.query(query, [id])
            res.status(200).json(rows)
        } catch (error) {
            return res.status(400).json(error.message)
        }
    } else {

        for (let i of filtro) {
            const tratado = i[0].toUpperCase() + i.slice(1).toLowerCase()
            filtroTratado.push(tratado)
        }


        for (let i = 0; i < filtroTratado.length; i++) {
            try {
                const pedaco = "%" + filtroTratado[i].slice(-4)
                const query = "SELECT id FROM categorias WHERE descricao LIKE $1"
                const { rows, rowCount } = await conexao.query(query, [pedaco])
                if (rowCount === 0) {
                    return res.status(400).json(`${filtro[i]} não é uma categoria válida `)
                }
                idsDoFiltro.push(rows[0].id)
            } catch (error) {

            }


        }

        for (let i of idsDoFiltro) {
            try {
                const query = `SELECT
                transacoes.id, transacoes.tipo, transacoes.descricao, transacoes.valor, transacoes.data, transacoes.usuario_id, 
                categoria_id, categorias.descricao AS "categoria_nome"
                FROM transacoes
                JOIN categorias ON categorias.id = transacoes.categoria_id
                 WHERE usuario_id = $1 AND categoria_id = $2   
                 `
                const { rows } = await conexao.query(query, [id, i])
                final.push(...rows)
            } catch (error) {

            }
        }



        return res.json(final)
    }
}





module.exports = { listarTransacoes }