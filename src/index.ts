import express from 'express'
import bodyParser from 'body-parser'
import todoRoutes from './routes'

const app = express()


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use("/", todoRoutes)

const PORT = 3000;
app.listen(PORT, ()=>{
    console.log(`server is running on: ${PORT}`)
})