const { faker } = require('@faker-js/faker');

const mysql = require('mysql2'); 

const connection =  mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'delta_app',
    password: 'R@ghav99',
  });

  //Inserting New Data
  let q = "INSERT INTO user (id,username,email,password) VALUES ?";
//   let users =
//   [["123", "123_newuser", 
// "asb@gmail.com", "abc"],
// ["123b", "123_newuserb", 
// "asb@gmail.comb", "abcb"],
// ["123c", "123_newuserc", 
// "asb@gmail.comc", "abcc"],
// ["123d", "123_newuserd", 
// "asb@gmail.comd", "abcd"]];
let RandomUser = () => {
  return [    
     faker.string.uuid(),
     faker.internet.userName(),
     faker.internet.email(),
     faker.internet.password(),
    ];
};

let data = [];
for(let i = 1; i <= 100; i++) {  
  data.push(RandomUser());
}

try{
  connection.query(q, [data], (err, result) => {
      if(err) throw err;
      console.log(result);
    });    
} catch(err) {
  console.log(err);
}

// try{
//     connection.query("SHOW TABLES", (err, result) => {
//         if(err) throw err;
//         console.log(result);
//       });    
// } catch(err) {
//     console.log(err);
// }

connection.end();






