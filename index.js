import express from "express";
import path from 'path';
import { MongoClient, ObjectId } from 'mongodb';

const app = express();

// Connection Starts

const dbName = "node-project";
const collectionName = "todo";
const client = new MongoClient("mongodb://localhost:27017");

const connection = async ()=>{
    const connect = await client.connect()
    return await connect.db(dbName);
}

// DB connection ends


app.set("view engine","ejs");
app.use(express.static(path.resolve('public')));
app.use(express.urlencoded({extended:false}));


app.get("/", async (req,res)=>{

    const db = await connection();
    const collection = db.collection(collectionName);
    const list = await collection.find().toArray();

    res.render("list", {list:list});
});

app.get("/add", (req,res)=>{
    res.render("add");
});

app.post("/edit", (req,res)=>{
    const data = req.body;
    res.render("update", {data:data});
});

app.post("/add", async (req,res)=>{
    const db = await connection();
    const collection = db.collection(collectionName);
    const result = await collection.insertOne(req.body);
    result ? res.redirect("/") : res.send("/add");
});

app.post("/update", async (req,res)=>{
    const db = await connection();
    const collection = db.collection(collectionName);
    const result = await collection.updateOne({_id:new ObjectId(req.body.id)}, {$set:{title:req.body.title, description:req.body.description}});
    result ? res.redirect("/") : res.send("/edit");
    res.send("Update");
});

app.post("/delete", async (req,res)=>{
    const db = await connection();
    const collection = db.collection(collectionName);
    console.log("ID : ",req.body.id);
    const del = await collection.deleteOne(req.params.id)
    del ? res.redirect("/") : res.send("oops!! cant delete the data");
});

app.post("/mark_as_read", async (req, res) => {
    const db = await connection();
    const collection = db.collection(collectionName);
    const tasks = Array.isArray(req.body["task[]"]) ? req.body["task[]"] : [req.body["task[]"]];
    console.log(tasks);
    res.send("ok");
});

app.listen(3200);