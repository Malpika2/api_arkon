const mysql = require('mysql');
const pool =  mysql.createPool({
    host: 'remotemysql.com',
    port:'3306',
    user:'JPvYP8PPMJ',
    password: 'BTcCOEJg82',
    database: 'JPvYP8PPMJ'
});

module.exports = {
    query: function(){
        var sql_args = [];
        var args = [];
        for(var i=0; i<arguments.length; i++){
            args.push(arguments[i]);
        }
        var callback = args[args.length-1]; //last arg is callback
        pool.getConnection(function(err, connection) {
        if(err) {
                console.log(err);
                return callback(err);
            }else{
                console.log('Conexion a la BD');
            }
            
            if(args.length > 2){
                sql_args = args[1];
            }
        connection.query(args[0], sql_args, function(err, results) {
          connection.release(); // always put connection back in pool after last query
          if(err){
                    console.log(err);
                    return callback(err);
                }
          callback(null, results);
        });
      });
    }
};

// var mysqlConnection;
// function crearConexion() {
// mysqlConnection = mysql.createConnection(config);

// mysqlConnection.connect(function (err){
//     if(err){
//         console.log('databaseErr',err);
//         setTimeout(crearConexion, 2000); 
//     }else{
//         console.log('Conexion a la BD');
//     }
// });

// mysqlConnection.on('error', function(err) {
//     console.log('db error', err);
//     if(err.code === 'PROTOCOL_CONNECTION_LOST') { 
//         console.log('intentando reconectar');
//         setTimeout(crearConexion, 2000); 
//     } if(err.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR'){
//         console.log('intentando reconectar');
//         setTimeout(crearConexion, 2000);         
//     } else {                                     
//         console.log('trow');
//         setTimeout(crearConexion, 2000); 
//       throw err;                                 
//     }
//   });

// }
// crearConexion();
// module.exports = mysqlConnection;