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
    password: ""
})


let posts = [
    
];

// View All Posts
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
    let id = uuidv4();
    let { username, content } = req.body; 
    try {
        connection.query(q, [id, username, content], (err, resut) => {           
            res.redirect("/posts");
            console.log("Post is posted");
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
        console.log("Post is Deleted");
    });
   } catch(err) {
    console.log(err);
    res.send("Some error in DB");
   }
});
app.get("/posts/:id", (req, res) => {
    let { id } = req.params;
    let q = `SELECT *FROM post WHERE id = '${id}'`;
    try {
        connection.query(q, (err, result) => {
            let post = result[0];
            res.render("show.ejs", { post });
        });
    } catch(err) {
        console.log(err);
        res.send("Some error in DB");
    }
});

// Edit Post
app.get("/posts/:id/edit", (req, res) => {
  let { id } = req.params;
  let q = `SELECT *FROM post WHERE id='${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let post = result[0];
      res.render("edit.ejs", { post });
    });
  } catch (err) {
    console.log(err);
    res.send("some error with DB");
  }
});
app.patch("/posts/:id", (req, res) => {
  let { id } = req.params;
  let { content } = req.body;
  let q2 = `UPDATE post SET content = '${content}' WHERE id = '${id}'`;
  try {
    connection.query(q2, (err, result) => {
      if (err) throw err;
    //   let post = result[0];
      res.redirect("/posts");
      
    });
  } catch (err) {
    console.log(err);
    res.send("some error with DB");
  }
});

app.listen(port, (req, res) => {
    console.log(`Listening on port '${port}`);
});
