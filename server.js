const express = require('express');
const mysql = require('mysql2')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json());


// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '9943060731',  
//     database: 'library'

// })

const db = mysql.createConnection(`mysql://avnadmin:AVNS_sdwvMqm_eFn5ewoJXi3@mysql-2b1fb47c-dhanushlib.a.aivencloud.com:21992/library`)

db.connect(()=>{
    console.log("database connectd")
})

app.get('/getbooks',(req,res)=>{
    const q='SELECT * FROM libdata';

    db.query(q,[],(err,data)=>{
        if(err)return res.json(err);

        return res.json(data)
    })
})

app.get('/fetch',(req,res)=>{
    let sql = "SELECT * FROM libdata WHERE stats=1;"
    db.query(sql,(err,results)=> {
        if(!err)  
            res.send(results);  
             else  
                console.error(err); 
    })  
})

app.get('/log/:user/:pass',(req,res)=>{
    let user = req.params.user;
    let  pass = req.params.pass;
    console.log(user,pass)
    let q ="UPDATE log set stats = 1 where username =? and pass=?;"
    db.query(q,[user,pass],(err,result)=>{
        if (!err) {
         console.log(result)
        }
        else {console.log(err)}
    })



    let sql = 'select * from log where username=? and pass=?;'
        db.query(sql,[user,pass],(err,result)=>{
            if (!err && result.length != 0){
                console.log('login success');
                res.send("true");
            }
            else {
                console.log('wrong password or user name')
            }
          
        })
})



app.get('/searchid/:id',(req,res)=>{
    let id = req.params.id;
    let sql = `SELECT * FROM libdata WHERE title = ?`
  
    db.query(sql,[id],(err,results)=> {
        if(!err)  
            res.send(results);  
             else  
                console.error(err); 
    })  
})

app.get('/searchtitle/:title',(req,res)=>{
    let title = req.params.title;
    let sql = `SELECT * FROM libdata WHERE bsubject = ?`
  
    db.query(sql,[title],(err,results)=> {
        if(!err)  
            res.send(results);  
             else  
                console.error(err); 
    })  
})

app.get('/searchname/:name',(req,res)=>{
    let name = req.params.name;
    let sql = `SELECT * FROM libdata WHERE author = ?`
  
    db.query(sql,[name],(err,results)=> {
        if(!err)  
            res.send(results);  
             else  
                console.error(err); 
    })  
})

app.get('/nextname/:name',(req,res)=>{
    let name = req.params.name;
    let sql = 'SELECT COUNT(bookid) AS val FROM libdata WHERE author=?;'
    db.query(sql,[name],(err,result)=>{
        if(!err){
            res.send(result)
            console.log(result)
        }
        else{
            console.error(err)
        }
    })
})

app.post('/apply/:from/:to',(req,res)=>{
    let from = req.params.from;
    let to = req.params.to;
     console.log('From: ',from,' To : ',to)

})

app.get('/nextfull',(req,res)=>{
   
    let sql = 'SELECT COUNT(bookid) AS val FROM libdata WHERE stats = 1;'
    db.query(sql,(err,result)=>{
        if(!err){
            res.send(result)
            console.log(result)
        }
        else{
            console.error(err)
        }
    })
})

app.get('/nexttitle/:title',(req,res)=>{
    let title = req.params.title;
   
    let sql = 'SELECT COUNT(bookid) AS val FROM libdata where title=?;'
    db.query(sql,[title],(err,result)=>{
        if(!err){
            res.send(result)
            console.log(result)
        }
        else{
            console.error(err)
        }
    })
})

app.get('/book/:bid',(req,res)=>{
    let bid = req.params.bid
    let sql = 'UPDATE libdata SET stats = 0 WHERE bookid=?;'
    db.query(sql,[bid],(err,result)=>{
        if (!err) {
           console.log('The data is updated')}
    })
})

app.get('/nextsubject/:sub',(req,res)=>{
    let sub = req.params.sub;
   
    let sql = 'SELECT COUNT(bookid) AS val FROM libdata where bsubject=?;'
    db.query(sql,[sub],(err,result)=>{
        if(!err){
            res.send(result)
            console.log(result)
        }
        else{
            console.error(err)
        }
    })
})


app.get('/add/:name/:title/:subject/:date',(req,res)=>{
    let name = req.params.name;
    let title = req.params.title;
    let subject = req.params.subject;
    let date = req.params.date;

    console.log(name,title,subject,date);

    let sql = "INSERT INTO libdata(author,title,bsubject,publishdate) VALUES(?,?,?,?);"
    db.query(sql,[name,title,subject,date],(err,result)=>{
        if(!err){
            console.log("success")
            res.send("succes")
        }
        else{
            console.error(err)
        }


    })

})
app.get('/adminadd/:bid/:bname/:btitle/:bsub',(req,res)=>{
    let bid = req.params.bid;
    let bname = req.params.bname;
    let btitle = req.params.btitle;
    let bsub = req.params.bsub;
    let sql = "INSERT INTO book (booked,author,title,sub) VALUES(?,?,?,?)"
    db.query(sql,[bid,bname,btitle,bsub],(err,result)=>{
        console.log("added")
    })


    console.log(bid,bname,btitle,bsub)
})

app.get('/adminfetch',(req,res)=>{
    let sql = "SELECT * FROM book;"
    db.query(sql,(err,result)=>{
        console.log("succes")
        res.send(result)
    })
})

app.get('/adminrem/:rmid',(req,res)=>{
    let rmid = req.params.rmid
    let sql = "DELETE FROM libdata WHERE bookid=?"
    db.query(sql,[rmid],(err,result)=>{
        console.log("removed")
        res.send(result)
    })
})





app.get('/adminremove/:id',(req,res)=>{
    let id = req.params.id;
    let sql = "UPDATE libdata set stats = 1  where bookid =?;"

    let q = "delete from book  where booked=?"
    db.query(q,[id],(err,r)=>{
        if(!err){
            console.log('removed')
        }
        else{
            console.log("bd rm")
        }
    })
    

    db.query(sql,[id],(err,result)=>{
       if(!err){
        console.log("suc")
       }
       else{
        console.error(err)
       }
    })
})






// app.get('/log/:user/:pass',(req,res)=>{
//     let user = req.params.user;
//     let pass = req.params.pass;
//     let sql = 'select * from log where username=? and pass=?;'
//     db.query(sql,[user,pass],(err,result)=>{
//         if (!err && result.length != 0){
//             console.log('login success');
//         }
//         else {
//             console.log('wrong password or user name')
//         }
//         res.send({"msg":result});
//     })
// })














app.listen('3000',()=>{
    console.log("connected 3000")
})