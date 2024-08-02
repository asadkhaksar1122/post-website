const express = require("express");
const app = express();
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const port = 3000;
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname + '/public')))
const mysql = require("mysql2");
require("dotenv").config();

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "first",
  password:process.env.PASSWORD,
});
app.get("/", (req, res) => {
  let q = `select * from posts`;
  connection.query(q, (error, result) => {
   try {
    if (error) {
      throw error;
     }
     let posts = result;
     console.log(posts);
       res.render("post.ejs", { posts });
   } catch (error) {
    
   }
  })

});
app.get('/post/:id', (req, res) => {
  let id = req.params.id;
  let q = `select * from posts where id = '${id}'`;
  connection.query(q, (error, result) => {
    try {
      if (error) {
        throw error
      }
      let post = result[0];
      res.render("detail.ejs", { post });
    } catch (error) {
      console.log(error);
    }
  })
  
})
app.get('/new', (req, res) => {
  res.render("newpost.ejs")
})
app.post('/new', (req, res) => {
  let { title, discription:body } = req.body;
  let id = uuidv4();
  let q = `insert into posts (id,name,body) values('${id}','${title}','${body}')`;
  connection.query(q,function (error,result) {
    try {
      if (error) {
        throw error
      }
   
       res.redirect("/");
    } catch (error) {
      console.log(error);
    }
  })
 
})
app.get('/edit/:id', (req, res) => {
 let { id } = req.params;
 let q = `select * from posts where id='${id}'`;
 connection.query(q, (error, result) => {
   try {
     if (error) {
       throw error;
     }
     let post = result;
     console.log(post);
     res.render("edit.ejs", { post });
   } catch (error) {}
 });
})
app.post('/edit/:id', (req, res) => {
  let { id } = req.params;
  let { title, discription:body } = req.body;
  let q = `update Posts set body='${body}' where id='${id}'`;
  connection.query(q,function(error,result) {
    try {
      if (error) {
        throw error
      }
      let post = result[0];
      console.log(post);
    } catch (error) {
      console.log(error);
    }
  })
   res.redirect("/");
  
})
app.get('/delete/:id', (req, res) => {
  let { id } = req.params;
  let q = `delete from posts where id='${id}'`;
  connection.query(q,function (error, result) {
   try {
    if (error) {
      throw error;
     }
     console.log(result);
     res.redirect("/");
   } catch (error) {
    console.log(error);
   }
  })

})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
