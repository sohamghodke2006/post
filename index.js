const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const { v4 : uuidv4 } = require("uuid");
const methodOverride = require("method-override");
const mysql = require("mysql2");

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended : true}));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "quora",
    password: "soham2006"
})


let posts = [
    {
        id : uuidv4(),
        username : "apnacollege",
        content : "I love coding!"
    },
    {
        id : uuidv4(),
        username : "sohamghodke",
        content : "Hard work is imp!"
    },
    {
        id : uuidv4(),
        username : "shraddhakhapra",
        content : "I got selected for my first internship"
    }
];

// All Posts
app.get("/posts", async (req, res) => {
    let q = "SELECT * FROM post";
    try {
        connection.query(q, (err, posts) => {
        if(err) throw err;
        res.render("index.ejs", { posts });
    });
    } catch(err) {
        console.log(err);
        res.send("Some error in DB");
    }
});

// Create New Post
app.get("/posts/new", (req, res) => {
    res.render("new.ejs");
});
app.post("/posts", (req, res) => {
    let q = "INSERT INTO post(id, username, content)  VALUES (?,?, ?)";

    try {
        connection.query(q, [id, username, content], (err, resut) => {
        let id = uuidv4();
        let { username, content } = req.body;            
            res.redirect("/posts");
        });

    } catch (err) {
        console.log(err);
        res.send("Some error in DB");
    }
       
});

// Delete Post
app.delete("/posts/:id", (req, res) => {
    let { id } = req.params;
    let q = `DELETE FROM post WHERE id = '${id}'`;

   try {
     connection.query(q, (err, result) => {
        if (err) throw err;
        res.redirect("/posts");
    });
   } catch(err) {
    console.log(err);
    res.send("Some error in DB");
   }
});

app.get("/posts/:id", (req, res) => {
    let { id } = req.params;
    let post = posts.find((p) => id === p.id );
    res.render("show.ejs", { post });
});

app.patch("/posts/:id", (req, res) => {
    let { id } = req.params;
    let newContent = req.body.content;
    let post = posts.find((p) => id === p.id );
    post.content = newContent;
    res.redirect("/posts");
});

app.get("/posts/:id/edit", (req, res) => {
    let { id } = req.params;
    let post = posts.find((p) => id === p.id );
    res.render("edit.ejs", { post });
});

app.delete("/posts/:id", (req, res) => {
    let { id } = req.params;
    posts = posts.filter((p) => id !== p.id );
    res.redirect("/posts");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});