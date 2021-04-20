const mysql = require('mysql');

function crearConexion() {
mysqlConnection = mysql.createConnection({
    host: 'remotemysql.com',
    port:'3306',
    user:'JPvYP8PPMJ',
    password: 'BTcCOEJg82',
    database: 'JPvYP8PPMJ'
});

mysqlConnection.connect(function (err){
    if(err){
        console.log('databaseErr',err);
        setTimeout(crearConexion, 2000); 
    }else{
        console.log('Conexion a la BD');
    }
});

mysqlConnection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { 
        crearConexion();                         
    } else {                                     
      throw err;                                 
    }
  });

}
crearConexion();
module.exports = mysqlConnection;