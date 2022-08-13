const conexao = require('../conexao.js');
const securePassword = require("secure-password")
const jwt = require("jsonwebtoken")
const jwtSecret = require("../jwt_secret")


const pwd = securePassword()

const login = async (req, res) => {
    const { email, senha } = req.body;

    if (!email) {
        return res.status(400).json("O campo email é obrigatório.");
    }

    if (!senha) {
        return res.status(400).json("O campo senha é obrigatório.");
    }

    try {
        const query = 'SELECT * FROM usuarios WHERE email = $1';
        const usuarios = await conexao.query(query, [email]);

        if (usuarios.rowCount == 0) {
            return res.status(400).json({ mensagem: "Email ou senha incorretos." });
        }

        const usuario = usuarios.rows[0];

        const result = await pwd.verify(Buffer.from(senha), Buffer.from(usuario.senha, "hex"));

        switch (result) {
            case securePassword.INVALID_UNRECOGNIZED_HASH:
            case securePassword.INVALID:
                return res.status(400).json({ mensagem: "Email ou senha incorretos." });
            case securePassword.VALID:
                break;
            case securePassword.VALID_NEEDS_REHASH:
                try {
                    const hash = (await pwd.hash(Buffer.from(senha))).toString("hex");
                    const query = 'UPDATE usuarios SET senha = $1 WHERE email = $2';
                    await conexao.query(query, [hash, email]);
                } catch {
                }
                break;
        }

        const { senha: senhaDoUsuario, ...dadosParaToken } = usuario

        const token = jwt.sign(dadosParaToken, jwtSecret);

        return res.status(202).json({ usuario: { ...dadosParaToken }, token });
    } catch (error) {
        return res.status(400).json(error.message);
    }

}

module.exports = {
    login
}