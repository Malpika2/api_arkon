const { Router, response } = require("express");
const router = new Router();
// const mysqlConnection = require("../database");
const bcrypt = require("bcryptjs");

router.get('/', (req, res) => {
    res.send('Bienvenidos ArkonData')
  })

router.post("/tareas", (req, resp) => {
    const { name, email, tipo } = req.body;
    console.log(req.body);
    const query =
      "INSERT INTO tareas (x,x ,x ) VALUES (?, ?, ?)";
    mysqlConnection.query(query, [ x, x,x ], (err, rows, fields) => {
      if (!err) {
        resp.status(201).json({ status: "201", message: "User added" });
      } else {
        resp.status(400).json({ messaje: err });
      }
    });
  });
  
  module.exports = router;