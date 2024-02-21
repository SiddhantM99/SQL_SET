const { faker } = require('@faker-js/faker');

const mysql = require('mysql2'); 

const express = require('express');
const app = express();

const path = require('path');
const { v4: uuidv4 } = require("uuid");
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true}));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

let getUser = () => {
  return [
    faker.datatype.uuid(),
    faker.internet.userName(),
    faker.internet.email(),
    faker.internet.password(),
  ];
};



const connection =  mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'delta_app',
    password: 'R@ghav99',
  });

  //Inserting New Data
  // let q = "INSERT INTO user (id,username,email,password) VALUES ?";
//   let users =
//   [["123", "123_newuser", 
// "asb@gmail.com", "abc"],
// ["123b", "123_newuserb", 
// "asb@gmail.comb", "abcb"],
// ["123c", "123_newuserc", 
// "asb@gmail.comc", "abcc"],
// ["123d", "123_newuserd", 
// "asb@gmail.comd", "abcd"]];

// let RandomUser = () => {
//   return [    
//      faker.string.uuid(),
//      faker.internet.userName(),
//      faker.internet.email(),
//      faker.internet.password(),
//     ];
// };

// let data = [];
// for(let i = 1; i <= 100; i++) {  
//   data.push(RandomUser());
// }

// try{
//   connection.query(q, [data], (err, result) => {
//       if(err) throw err;
//       console.log(result);
//     });    
// } catch(err) {
//   console.log(err);
// }

// try{
//     connection.query("SHOW TABLES", (err, result) => {
//         if(err) throw err;
//         console.log(result);
//       });    
// } catch(err) {
//     console.log(err);
// }

// connection.end();

app.listen(8080, (req,res) => {
  console.log(`port is listening `);
});

app.get("/", (req,res) => {
  let q =`SELECT count(*) FROM user`;
  try{
      connection.query(q, (err, result) => {
          if(err) throw err;
         let count = result[0]["count(*)"];
          res.render("home.ejs", {count});

        });    
    } catch(err) {
      console.log(err);
      res.send("Some error in DB");
    }
});



app.get("/user", (req,res) => {

  let q =`SELECT * FROM user`;
  try{
      connection.query(q, (err, users) => {
          if(err) throw err;
        res.render("showuser.ejs", {users});
        });    
    } catch(err) {
      console.log(err);
      res.send("Some error in DB");
    }
});

// EDIT PAGE (DB)
app.get("/user/:id/edit", (req, res) => {
  let {id} = req.params;
 let q = `SELECT * FROM user WHERE id='${id}'`;
 try{
   connection.query(q, (err, result) => {
       if(err) throw err;
       let user = result[0];
       res.render("edit.ejs", {user});
     });    
 } catch(err) {
   console.log(err);
   res.send("Some error in DB");
 }
});

// UPDATE ROUTE (DB)

app.patch("/user/:id", (req, res) => {
  let {id} = req.params;
  let {password: formPass, username: newUsername} = req.body;
  let q = `SELECT * FROM user WHERE id='${id}'`;
  try{
    connection.query(q, (err, result) => {
        if(err) throw err;
        let user = result[0];
        if(formPass != user.password)
        {
          res.send("Wrong password");
        }

        else{
          let  q2 = `UPDATE user SET Username='${newUsername}' WHERE id='${id}'`;
          connection.query(q2, (err, result) => {
            if (err) throw err;
            res.redirect("/user");
          });
        }
      });    
  } catch(err) {
    console.log(err);
    res.send("Some error in DB");
  }
});

app.get("/user/new", (req, res) => {
  res.render("new.ejs");
});

app.post("/user/new", (req, res) => {
  let { username, email, password } = req.body;
  let id = uuidv4();
  //Query to Insert New User
  let q = `INSERT INTO user (id, username, email, password) VALUES ('${id}','${username}','${email}','${password}') `;

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      console.log("added new user");
      res.redirect("/user");
    });
  } catch (err) {
    res.send("some error occurred");
  }
});

app.delete("/user/:id/", (req, res) => {
  let { id } = req.params;
  let { password } = req.body;
  let q = `SELECT * FROM user WHERE id='${id}'`;

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];

      if (user.password != password) {
        res.send("WRONG Password entered!");
      } else {
        let q2 = `DELETE FROM user WHERE id='${id}'`; //Query to Delete
        connection.query(q2, (err, result) => {
          if (err) throw err;
          else {
            console.log(result);
            console.log("deleted!");
            res.redirect("/user");
          }
        });
      }
    });
  } catch (err) {
    res.send("some error with DB");
  }
});








