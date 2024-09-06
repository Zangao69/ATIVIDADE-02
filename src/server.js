/**
 * MODEL -> DB BD -> Regras de negocio
 * CONTROLLER -> controla o que vem do view e devolve o que vem do model
 * VIEW -> Páginas
 */

import "dotenv/config"
import express from "express"
import cors from "cors"

//importar a conexão com o banco
import conn from "./config/conn.js"

//importar modulos
import "./models"

//importar as rotas
import usuarioRouter from "./routes/usuarioRouter.js"

const PORT = process.env.PORT || 3333
const app = express()

//3 middleware
app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())

//Utilizar as rotas
app.use("/usuarios", usuarioRouter)

app.get((request, response) => {
    response.status(404).json({message:"Rota não encontrada"})
})

app.listen(PORT, ()=>{
    console.log(`Servidor on port ${PORT}`)
})