const conexao = require('../conexao');
const securePassword = require("secure-password")

const pwd = securePassword()

const cadastrarUsuarios = async (req, res) => {


    const { nome, email, senha } = req.body

    if (!nome || !email || !senha) {
        return res.status(400).json("Todos os campos são obrigatórios")
    }

    try {
        const queryE = "SELECT * FROM usuarios WHERE email = $1";
        const { rowCount: rowCountE } = await conexao.query(queryE, [email])
        if (rowCountE > 0) {
            return res.status(400).json({ mensagem: "Já existe usuário cadastrado com o e-mail informado." })
        }
    } catch {
        return res.status(400).json(error.message)
    }

    try {
        const hash = (await pwd.hash(Buffer.from(senha))).toString("hex")
        const query = `
        INSERT INTO usuarios (nome, email, senha)
        VALUES
        ($1, $2, $3)`
        const { rowCount } = await conexao.query(query, [nome, email, hash])

        return rowCount > 0 ? res.status(200).json({ mensagem: "Usuário cadastrado" }) : res.status(400).json({ mensagem: "Erro ao cadastrar usuário" })

    } catch (error) {

        return res.status(400).json(error.message)
    }

}


module.exports = {
    cadastrarUsuarios
}