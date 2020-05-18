var pool = require('../helpers/pg.js');

exports.list_all = (cb) => {
    pool.select_multi('select count(date) as date_count,host.uuid,host.hostname from host left join date on host.id=date.host_id group by(host.id) order by hostname,uuid asc', [] ,function(err,data) {
        cb(err,data);
    });
}

exports.list_non_claimed = (cb) => {
    pool.select_multi('select count(date) as date_count,host.uuid,host.hostname from host left join date on host.id=date.host_id where host.id not in (select host_id from grants) group by(host.id) order by hostname,uuid asc', [] ,function(err,data) {
        cb(err,data);
    });
}

exports.list_by_user = (user,cb) => {
    pool.select_multi('select count(date) as date_count,host.uuid,host.hostname from host left join date on host.id=date.host_id where host.id in (select host_id from grants where user_id=$1) group by(host.id) order by hostname,uuid asc', [user] ,function(err,data) {
        cb(err,data);
    });
}

exports.add = (uuid,hostname,publickey,cb) => {
    pool.insert('insert into host (uuid,hostname,public_key) values ($1,$2,$3)',[uuid,hostname,publickey], function(err) {
        if (err) {
            console.log("hostModel grantuser err:"+err)
            cb(err);
        } else {
            cb(null);
        }
    });
}

exports.grantuser = (uuid,user,cb) => {
    pool.insert('insert into grants (host_id,user_id) values ((select id from host where uuid=$1),$2)',[uuid,user], function(err) {
        if (err) {
            console.log("hostModel grantuser err:"+err)
            cb(err);
        } else {
            cb(null);
        }
    });
}

exports.has_grant = (uuid,user,cb) => {
    pool.select_single('select * from grants where host_id=(select id from host where uuid=$1) and user_id=$2', [uuid,user] ,function(err,data) {
        if (err) {
            console.log("hostModel has_grant err:"+err)
            cb(err,null);
        } else {
            cb(null,data);
        }
    });
}

