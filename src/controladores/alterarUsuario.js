const conexao = require('../conexao')
const securePassword = require("secure-password")
const pwd = securePassword()



const alterarUsuario = async (req, res) => {
    const { id } = req.usuario
    const { nome, email, senha } = req.body

    if (!email) {
        return res.status(400).json({ mensagem: "O campo email é obrigatório." });
    }

    if (!senha) {
        return res.status(400).json({ mensagem: "O campo senha é obrigatório." });
    }
    if (!nome) {
        return res.status(400).json({ mensagem: "O campo nome é obrigatório." });
    }
    try {
        const queryE = "SELECT * FROM usuarios WHERE email = $1";
        const { rows, rowCount: linhas } = await conexao.query(queryE, [email])
        if (rows[0].id !== id & linhas > 0) {
            return res.status(400).json({ mensagem: "O e-mail informado já está sendo utilizado por outro usuário." })
        }

        const hash = (await pwd.hash(Buffer.from(senha))).toString("hex")
        const query = "UPDATE usuarios SET nome = $1, email = $2, senha= $3 WHERE id = $4"
        const { rowCount } = await conexao.query(query, [nome, email, hash, id])
        return rowCount > 0 ? res.status(204).json() : res.status(400).json({ mensagem: "Não foi possível realizar a alteração" })

    } catch (error) {
        res.status(400).json(error.message)
    }

}




module.exports = { alterarUsuario }