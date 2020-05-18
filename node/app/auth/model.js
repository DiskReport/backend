var pool = require('../helpers/pg.js');

exports.list = (cb) => {
    pool.select_multi('SELECT id,username from users', [] ,function(err,data) {
        cb(err,data);
    });
}

exports.add = (username,password_hash,email,cb) => {
    pool.insert('insert into users (username,password,email) values ($1,$2,$3)',[username,password_hash,email], function(err) {
        if (err) {
            console.log("userModel add err:"+err)
            cb(err);
        } else {
            cb(null);
        }
    });
}

exports.get_by_email = (email,cb) => {
    pool.select_multi('SELECT * from users where email=$1', [email] ,function(err,data) {
        cb(err,data);
    });
}
