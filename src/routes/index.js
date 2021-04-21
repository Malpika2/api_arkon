const { Router, response } = require("express");
const router = new Router();
const mysqlConnection = require("../database");
const bcrypt = require("bcryptjs");

router.get('/', (req, res) => {
    res.send('Bienvenidos ArkonData')
  })
router.post("/tareas", (req, resp) => {
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
  
  router.get('/tareas', (req, resp) => {
    mysqlConnection.query("SELECT * FROM arkondata", (err, rows, fields) => {
      if(!err){
        resp.status(200).json({status:"200", data:rows})
      }else{
        resp.status(400).json({error:err})
      }
    })
  })
  module.exports = router;