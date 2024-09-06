import conn from "../config/conn.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid"

export const register = async (req, res) => {
    const { nome, email, telefone, senha, confirmarsenha } = req.body

    if (!nome) {
        res.status(400).json({ message: "O nome é obrigatorio" })
    }
    if (!email) {
        res.status(400).json({ message: "O E-mail é obrigatorio" })
    }
    if (!telefone) {
        res.status(400).json({ message: "O telefone é obrigatorio" })
    }
    if (!senha) {
        res.status(400).json({ message: "A senha é obrigatorio" })
    }
    if (!confirmarsenha) {
        res.status(400).json({ message: "O campo confirma senha é obrigatorio" })
        return
    }

    //verificar se o email é valido
    if (!email.includes("@")) {
        res.status(400).json({ message: "O @ é obrigatorio" })
        return
    }
    if (senha !== confirmarsenha) {
        res.status(400).json({ message: "A senha e a confirmaççao de senha devem ser iguais" });
        return
    }

    const checkSql = /*sql*/ `SELECT * from usuarios where ?? = ?`
    const checkSqlData = ["email", email]
    conn.query(checkSql, checkSqlData, async (err, data) => {
        if (err) {
            console.error(err)
            res.status(500).json({ err: "Erro ao buscar email para cadastro" })
            return
        }

        //2º
        if (data.length > 0) {
            res.status(409).json({ err: "O email já esta em uso" })
            return
        }

        //posso fazer o registro
        const salt = await bcrypt.genSalt(12)
        // console.log(salt)
        const senhaHash = await bcrypt.hash(senha, salt)
        // console.log("Senha digitada: ",senha)
        // console.log("Senha com hash: ",senhaHash)

        //Criar o usuario
        const id = uuidv4();
        const usuario_img = "userDefault.png"
        const insertSql = /*sql*/ `insert into usuarios
        (??,??,??,??,??,??) values (?,?,?,?,?,?)
        `
        const insertSqlData = ["usuario_id, nome, email, telefone, senha, imagem", id, nome, email, telefone, senha, imagem]
        conn.query(insertSql, insertSqlData, (err) =>{
            if (err) {
                console.error(err);
                response.status(500).json({ err: "Erro ao cadastrar usuario" })
                return
            }
            res.status(200).json({ message: "Usuario cadastrado com sucesso" })
        })
    })
}