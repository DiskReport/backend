var pool = require('../helpers/pg.js');
var reportModel = require('./model.js');
var hostModel = require('../host/model.js');

exports.list = (req,res,next) => {
    var promise_has_grant = new Promise(function(resolve,reject) {
        hostModel.has_grant(req.query.host,req.userData.id,function(err,grant) {
            if (err) {
                reject(err);
            } else {
                resolve(grant);
            }
        });
    });

    var promise_path_content = new Promise(function(resolve,reject) {
        reportModel.get_path_content(req.query.host,req.query.path,function(err,path_content) {
            if (err) {
                reject(err);
            } else {
                resolve(path_content);
            }
        });
    });

    var promise_path_dates = new Promise(function(resolve,reject) {
        reportModel.get_host_dates(req.query.host,function(err,dates) {
            if (err) {
                reject(err);
            } else {
                resolve(dates);
            }
        });
    });

    Promise.all([
        promise_has_grant,
        promise_path_content,
        promise_path_dates
    ]).then(function(all_results) {
        var has_grant=all_results[0];
        if (! has_grant && req.userData.admin==false) {
            res.status(401).send({error: "grant missing"});
        } else {
            var data={};
            data['content']=all_results[1];
            data['dates']=all_results[2];
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(data);
        }
    }).catch(function(err){
        console.log("reportController Internal Server Error");
        res.status(500).send("Internal Server Error");
    });
}

