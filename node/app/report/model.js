var pool = require('../helpers/pg.js');

exports.get_path_content = (uuid,path,cb) => {
    pool.select_single('SELECT content from path where host_id=(select id from host where uuid=$1) and path=$2', [uuid,path] ,function(err,data) {
      if (data) {
          cb(err,data.content);
      } else {
          console.log('no content in uuid:'+uuid+' for path:'+path)
          cb(err,{})
      }
    });    
}

exports.get_host_dates = (uuid,cb) => {
    pool.select_multi('SELECT extract(epoch from timestamp) as timestamp from date where host_id=(select id from host where uuid=$1) order by timestamp asc', [uuid] ,function(err,data) {
      if (err) {
          cb(err,null);
      } else {
          var dates=[];
          for (var i=0; i<data.length; i++) {
              dates.push(data[i].timestamp);
          }
          cb(null,dates);
      }
    });
}


