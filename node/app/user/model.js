var pool = require('../helpers/pg.js');

exports.list = (cb) => {
    //console.log("userModel listing");
    pool.select_multi('SELECT id,username from users', [] ,function(err,data) {
        cb(err,data);
    });
}

exports.add = (username,password_hash,email,cb) => {
    //console.log("userModel add");
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
    //console.log("userModel get_by_email");
    pool.select_single('SELECT * from users where email=$1', [email] ,function(err,data) {
        //console.log("userModel get_by_email, data:"); console.log(data)
        cb(err,data);
    });
}

exports.get_by_username = (username,cb) => {
    //console.log("userModel get_by_username");
    pool.select_single('SELECT * from users where username=$1', [username] ,function(err,data) {
        //console.log("userModel get_by_username, data:"); console.log(data)
        cb(err,data);
    });
}
