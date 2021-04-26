const { Router, response } = require("express");
const router = new Router();
const mysqlConnection = require("../database");

router.get('/', (req, res) => {
    res.send('Bienvenidos ArkonData')
  })
router.post("/tareas", (req, resp) => {
    const { titulo, descripcion, minutes, seconds } = req.body;
    const duracion = minutes*60 + seconds;
    let day = new Date().getDate();
    let month = new Date().getMonth()+1;
    if(month<10) month = `0${month}`;
    let year = new Date().getFullYear();
    const create_at = `${year}-${month}-${day}`;
    console.log(create_at);
    mysqlConnection.query( "SELECT MAX(id) as lastId from arkondata", (err, result, fields) => {
      let query = '';
      if (result[0].lastId !==null ) {
        const lastId = result[0].lastId + 1;
         query = `INSERT INTO arkondata (titulo,descripcion ,duracion, restante, estatus, posicion,create_at ) VALUES (?, ?, ?, ?,'Pendiente', ${lastId}, ?)`;
        } else {
          const lastId = 1
           query = `INSERT INTO arkondata (titulo,descripcion ,duracion, restante, estatus, posicion, create_at ) VALUES (?, ?, ?, ?,'Pendiente', ${lastId}, ?)`;
        }
        mysqlConnection.query(query, [ titulo, descripcion,duracion, duracion, create_at ], (err, rows, fields) => {
          if (!err) {
            resp.status(201).json({ status: "201", message: "Tarea registrada",data:rows.insertId });
          } else {
            resp.status(400).json({ messaje: err });
          }
        });
      });
  });
  router.post("/tareas/masivo", (req, resp) => {
    const { titulo, descripcion, duracion ,restante,create_at} = req.body;
    
    mysqlConnection.query( "SELECT MAX(id) as lastId from arkondata", (err, result, fields) => {
      let query = '';
      if (result[0].lastId !==null ) {
        const lastId = result[0].lastId + 1;
         query = `INSERT INTO arkondata (titulo,descripcion ,duracion, restante, estatus, posicion, create_at ) VALUES (?, ?, ?, ?,'Finalizada', ${lastId}, ?)`;
        } else {
          const lastId = 1
           query = `INSERT INTO arkondata (titulo,descripcion ,duracion, restante, estatus, posicion, create_at  ) VALUES (?, ?, ?, ?,'Finalizada', ${lastId}, ?)`;
        }
        mysqlConnection.query(query, [ titulo, descripcion,duracion, restante , create_at], (err, rows, fields) => {
          if (!err) {
            resp.status(201).json({ status: "201", message: "Tarea registrada",data:rows.insertId });
            
          } else {
            resp.status(400).json({ messaje: err });
            
          }
        });
      });
  });
  
  router.get('/tareas', (req, resp) => {
    mysqlConnection.query("SELECT id,titulo, descripcion, duracion, restante, estatus, posicion,create_at  FROM arkondata WHERE estatus != 'Finalizada' ORDER BY posicion ASC", (err, rows, fields) => {
      if(!err){
        resp.status(200).json({status:"200", data:rows});

      }else{
        resp.status(400).json({error:err});
      }
    })
  })
  router.get('/tareas/completas', (req, resp) => {
    mysqlConnection.query("SELECT id,titulo, descripcion, duracion, restante, estatus, posicion,create_at  FROM arkondata WHERE estatus = 'Finalizada' ORDER BY posicion ASC", (err, rows, fields) => {
      if(!err){
        resp.status(200).json({status:"200", data:rows});

      }else{
        resp.status(400).json({error:err});
      }
    })
  })
  router.get('/tareas/estadisticas', (req, resp) => {
    mysqlConnection.query("SELECT COUNT(id) as total, create_at FROM arkondata WHERE estatus = 'Finalizada' GROUP BY create_at ", (err, rows, fields) => {
      if(!err){
        resp.status(200).json({status:"200", data:rows});

      }else{
        resp.status(400).json({error:err});
      }
    })
  })

  router.put('/tareas/posicion/', (req, resp) => {
    const {idTarea, posicionInicial, posicionFinal} = req.body;
    const query = "UPDATE arkondata SET posicion = ?  WHERE posicion = ?";
    mysqlConnection.query(query,[posicionInicial, posicionFinal], (err) => {
      if(!err){
        const sql = "UPDATE arkondata SET posicion = ?  WHERE id = ?";
        mysqlConnection.query(sql,[posicionFinal,idTarea], (error, rows) => {
          if(!error){
            resp.status(200).json({status:"200", data:rows});    
          }else{
            resp.status(500).send(error);
          }
        })
      }else{
       resp.status(500).send(err);
      }
    })
    console.log('posicionInicial',posicionInicial);
    console.log('posicionFinal',posicionFinal);
  })

  router.put('/tareas',(req, resp) => {
    const { titulo, descripcion, minutes, seconds,idTarea } = req.body;
    const duracion = minutes*60 + seconds;
    const query = "UPDATE arkondata SET descripcion = ? , duracion = ?, restante = ?  WHERE id = ?";
    mysqlConnection.query(query,[descripcion, duracion, duracion, idTarea], (err) => {
      if(!err){
        resp.status(200).json({estatus:'200',message:'Actualizacion exitosa'});
      }else{
       resp.status(500).send(err);
      }
    })
  });

  router.put('/tareas/iniciar', (req, resp) => {
    const {idTarea} = req.body;
    const query = "UPDATE arkondata SET estatus = 'Activa', posicion = 0 WHERE id = ?";
    mysqlConnection.query(query,[idTarea], (err) => {
      if(!err){
        resp.status(200).json({estatus:200,message:'Tarea Iniciada'});
      }else{
       resp.status(500).send(err);
      }
    })
  })

  router.put('/tareas/toggle', (req, resp) => {
    console.log('toggle');
    const {idTarea,action,tiempoRestante} = req.body;
    console.log('action',action);
    console.log('tiempoRestante',tiempoRestante);
    const query = "UPDATE arkondata SET estatus = ? , restante = ? WHERE id = ?";
    mysqlConnection.query(query,[action,tiempoRestante,idTarea], (err) => {
      if(!err){
        resp.status(200).json({estatus:200,message:'Tarea Actualizada'});
      }else{
       resp.status(500).send(err);
      }
    })
  })

  router.delete('/tareas/:idTarea',(req, resp) => {
    const idTarea = req.params.idTarea;
    console.log(idTarea);
    const query = "DELETE from arkondata WHERE id = ?";
    mysqlConnection.query(query,[idTarea], (err) => {
      if(!err){
        resp.status(200).json({estatus:'200',message:'¡Eliminado!'});
      }else{
       resp.status(500).send(err);
      }
    })
  });
  module.exports = router;