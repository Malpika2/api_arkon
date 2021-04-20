const { Router, response } = require("express");
const router = new Router();
const mysqlConnection = require("../database");
const bcrypt = require("bcryptjs");

router.get('/', (req, res) => {
    res.send('Bienvenidos ArkonData')
  })

router.post("/tareas", (req, resp) => {
  console.log(req.body);
    const { titulo, descripcion, minutes, seconds } = req.body;

    const duracion = minutes*60 + seconds;

    const query =
      "INSERT INTO arkondata (titulo,descripcion ,duracion,estatus ) VALUES (?, ?, ?,'Pendiente')";
    mysqlConnection.query(query, [ titulo, descripcion,duracion ], (err, rows, fields) => {
      console.log(query);
      if (!err) {
        resp.status(201).json({ status: "201", message: "Tarea registrada" });
      } else {
        resp.status(400).json({ messaje: err });
      }
    });
  });
  
  module.exports = router;