const express = require ("express");
const app=express();
const mysql = require('mysql');
const cors= require('cors');
const bcrypt=require('bcrypt');
const { response } = require("express");
require("dotenv").config();

const salt=10;

app.use(cors());
app.use(express.json());

const db =mysql.createConnection({

    user: "root",
    host:"localhost",
    password:"root",
    database:"georblog"
})

// add a user to database
app.post('/adduser', (req, res)=>{
    const uname=req.body.uname
    const email=req.body.email
    const pass=req.body.pass

    bcrypt.hash(pass, salt, (err, hash)=>{
        if (err){
            console.log(err)
        }
        db.query('INSERT INTO users (user_name, email, u_password) VALUES (?,?,?)',
        [uname, email, hash], (err, result)=>{
            if (err){
                console.log(err);
                //res.send(err)
            }else{
               //result.send("added") 
               res.send(result)
               console.log("added succefully")
            }
        });
    })
    })

//login user
app.post('/login', (req,res)=>{
    const name=req.body.uname
    const pass=req.body.pass
  

    db.query("SELECT * FROM users WHERE user_name=?", name, (err, result)=>{
        if (err){
            res.send({err: err});
            console.log(err)
        }
        if (result.length>0){
            bcrypt.compare(pass,result[0].u_password, (err, response)=>{
                if(response){
                    res.send(result[0] )
                    console.log(result)

                }else{
                    res.send({message: "Wrong user name password combination"});
                    console.log("Wrong user name password")
                }
            })
        }else{
            res.send({message: "User doesn't exists"})
            console.log("not user")
        }
    })
})    

 


// add a post
app.post('/blogs', (req, res)=>{
    const title=req.body.title
    const blog=req.body.body
    const author=req.body.author

    db.query('INSERT INTO posts (title, content, authorID) VALUES (?,?,?)',
    [title, blog, author], (err, result)=>{
        if (err){
            console.log(err);
        }else{
           //result.send("added") 
           res.send("added to db")
           console.log("added succefully")
        }
    });
})

//get all the post from db 
app.get('/blogs', (req,res)=>{
   
    db.query('SELECT posts.id,  posts.title, posts.content, users.user_name as author FROM posts INNER JOIN users ON posts.authorID = users.id', 
    (err, result)=>{
        if (err){
            console.log(err);
        }else{
           //result.send("added") 
           console.log(result);
           res.send(result)
           console.log("data sent")
           //res.send("data sent")
        }
    })
})

app.get('/user/:id', (req,res)=>{
    const u_id= req.params.id;
    db.query('SELECT posts.id,  posts.title, posts.content, users.user_name as author FROM posts INNER JOIN users ON posts.authorID = users.id WHERE users.id=?',[u_id], 
    (err, result)=>{
        if (err){
            console.log(err);
        }else{
           //result.send("added") 
           console.log(result);
           res.send(result)
           console.log("data sent")
           //res.send("data sent")
        }
    })
})

//  app.get('/userinfo/:id', (req,res)=>{
//     const u_id= req.params.id;
//     db.query('select users.user_name,users.email,users.sing_date,count(posts.id) as numofposts from users left join posts on users.id=posts.authorID where users.id=?',[u_id], 
//     (err, result)=>{
//         if (err){
//             console.log(err);
//         }else{
//            //result.send("added") 
//            console.log(result);
//            res.send(result[0])
//            console.log("******data sent")
//            //res.send("data sent")
//         }
//     })
// })

// udate a post 
app.put('/update', (req,res)=>{
    const title=req.body.title
    const content=req.body.body
    const id=req.body.id

    db.query('UPDATE posts SET title=?, content=? WHERE id=?',[title, content,id], (err, result)=>{
        if (err){
            console.log(err);
        }else{
           //result.send("added") 
           res.send(result)
           console.log("updated data")
           //res.send("data sent")
        }
    })


})

// get details for a post
app.get('/blogs/:id', (req,res)=>{
    const id= req.params.id;
    //console.log("qwert"+id)
    db.query('SELECT posts.id, posts.title, posts.content, users.user_name as author FROM posts INNER JOIN users ON posts.authorID = users.id where posts.id=?', [id], (err, result)=>{
        if (err){
            console.log(err);
        }else{
           //result.send("added") 
           res.send(result[0])
           //console.log(result)
        }
    })
})

// delete a post
app.delete('/blogs/:id', (req, res)=>{
    const id= req.params.id;
    
    db.query('DELETE FROM posts WHERE id=?', id, (err,result)=>{
        if (err){
            console.log(err);
        }else{
           //result.send("added") 
           res.send(result)
           console.log('item deleted ')
        }
    })
})



app.listen(process.env.PORT||3001, ()=>{
    console.log("server runing on 3001")
})