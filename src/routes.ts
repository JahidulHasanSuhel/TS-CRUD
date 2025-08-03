import { Router, Request, Response } from "express";
import pool from './db'


const router = Router();

interface Todo {
    id: number;
    title: string;
    completed: boolean;
}

router.get("/", (req: Request, res: Response)=>{
    res.send("Welcome to the Project")
})

//get all
router.get("/todos", async(req : Request, res: Response)=>{
    try {
        const result = await pool.query("select * from todos");
        const todos: Todo[] = result.rows;
        res.json(todos);

    } catch (error) {
        console.log("Error fetching data", error);
        res.status(500).json({error: "Error fetching todos"})
    }
})

//create task
router.post("/todos", async(req: Request, res: Response)=>{
    const {title, completed} = req.body;

    if(typeof title !== "string" || title.trim() === ""){
        return res.status(400).json({error: "Invalid title data"});
    }

    try {
        const result = await pool.query(
            "insert into todos (title, completed) values ($1, $2) returning *", [title, completed]
        );
        const createdTodo: Todo = result.rows[0];
        res.status(201).json({createdTodo})
    } catch (error) {
        console.error("Error adding todo", error);
        res.status(500).json({ error: "Error adding todo" });
    }

})

//delete
router.delete("/todos/:id", async(req:Request, res:Response)=>{
    const todoId = parseInt(req.params.id, 10);

    if(isNaN(todoId)){
        res.status(400).json({error: "Invalid Id"})
    }

    try {
        await pool.query("delete from todos where id = $1", [todoId]);
        res.status(200).json({message: "successfully deleted"})
    } catch (error) {
        console.error("error deleting todo", error)
        res.status(500).json({error: "Error deleting todo"})
    }
});

router.put("/todos/:id", async(req: Request, res: Response)=>{
    const todoId = parseInt(req.params.id, 10);
    const {title} = req.body;

    if(typeof title !== "string" || title.trim() === ""){
        return res.status(400).json({error: "Invalid task data"});
    }

    try {
        await pool.query("update todos set title = $1 where id =$2", [title, todoId]);
        res.status(200).json({msg: "Todo updated succesfully"});
    } catch (error) {
        console.error("error updating todo", error);
        res.status(500).json({error: "error updating todo"})
    }
});


export default router;