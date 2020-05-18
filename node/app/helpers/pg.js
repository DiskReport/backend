const {Pool} = require('pg');

// PostgreSQL
var config = {
  user: process.env.POSTGRES_USER,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST || 'database',
  port: process.env.POSTGRES_PORT || 5432,
  max: 10, // max number of connection can be open to database
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};
const pool = new Pool(config);

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

module.exports.query = (text, values) => {
  return pool.query(text, values)
}


module.exports.connect = (cb) => {
  return pool.connect(cb)
}

module.exports.select_single = (query,args,cb) => {
   pool.connect(function(err,client,done) {
      if(err){
          console.log("not able to get connection "+ err);
          cb({error: err.reason});
      } else {
          client.query(query, args ,function(err,result) {
              done();
              if(err){
                  console.log(err);
                  cb(err,null)
              }
              if (result.rows.length == 1) {
                  cb(null,result.rows[0])
              } else {
                  cb(null,null)
              }
          });
      }
   });
}

module.exports.select_multi = (query,args,cb) => {
   pool.connect(function(err,client,done) {
      if(err){
          console.log("not able to get connection "+ err);
          cb({error: err.reason});
      } else {
          client.query(query, args ,function(err,result) {
              done();
              if(err){
                  console.log(err);
                  cb(err,null)
              } else {
                  cb(null,result.rows)
              }
          });
      }
   });
}

module.exports.insert = (query,args,cb) => {
   pool.connect(function(err,client,done) {
      if(err){
          console.log("not able to get connection "+ err);
          cb({error: err.reason});
      } else {
          client.query(query, args ,function(err,res) {
              done();
              if(err){
                  console.log(err,res);
                  cb(err.detail)
              } else {
                  cb(null)
              }
          });
      }
   });
}
