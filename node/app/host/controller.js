var pool = require('../helpers/pg.js');
var hostModel = require('./model.js');
var crypto = require('crypto');

exports.list = (req,res,next) => {
    if (req.userData.admin) {
        hostModel.list_all(function(err,data) {
            if(err) {
              console.log("hostController listing error "+ err);
              res.status(500).json({error: err})
            } else {
              res.status(200).json(data)
            }
        });
    } else {
        hostModel.list_by_user(req.userData.id,function(err,data) {
            if(err) {
              console.log("hostController listing error "+ err);
              res.status(500).json({error: err})
            } else {
              res.status(200).json(data)
            }
        });
    }
}

exports.list_non_claimed = (req,res,next) => {
    hostModel.list_non_claimed(function(err,data) {
        if(err) {
          console.log("hostController listing error "+ err);
          res.status(500).json({error: err})
        } else {
          res.status(200).json(data)
        }
    });
}

exports.register = (req,res,next) => {
  if (! req.headers.publickey) {
      res.status(404).json({message: 'missing publickey'})
  } else {
      var publickeypem=Buffer.from(req.headers.publickey,'base64').toString('ascii');
      var lines = publickeypem.split('\n');
      var publickeybase64 = '';
      for(var i = 0;i < lines.length;i++){
        if (lines[i].trim().length > 0 &&
            lines[i].indexOf('-BEGIN RSA PRIVATE KEY-') < 0 && 
            lines[i].indexOf('-BEGIN RSA PUBLIC KEY-') < 0 &&
            lines[i].indexOf('-BEGIN PUBLIC KEY-') < 0 &&
            lines[i].indexOf('-END PUBLIC KEY-') < 0 &&
            lines[i].indexOf('-END RSA PRIVATE KEY-') < 0 &&
            lines[i].indexOf('-END RSA PUBLIC KEY-') < 0) {
          publickeybase64 += lines[i].trim();
        }
      }
      var uuid=crypto.createHash('md5').update(publickeybase64,'base64').digest('hex');
      var publickey = crypto.createPublicKey(publickeypem)
      if (! req.headers.signature) {
          res.status(404).json({message: 'missing signature'})
      } else {
          var signaturebase64=req.headers.signature;
          if (! req.body.hostname) {
              res.status(404).json({message: 'missing hostname'})
          } else {
              var data=req.body.hostname
              const verifier = crypto.createVerify('sha256')
              verifier.update(data, 'ascii')
              if (! verifier.verify(publickey, signaturebase64,'base64')) {
                  res.status(403).json({message: 'verify failed'})
              } else {
                  hostModel.add(uuid,data,publickeypem,function(err,data) {
                      if(err) {
                        console.log("hostController add error "+ err);
                        res.status(500).json({error: err})
                      } else {
                        res.status(200).json({register: 'OK'})
                      }
                  });
              }
          }
      }
   }
}

exports.grantuser = (req,res,next) => {
  console.log(req.headers)
  if (! req.headers.publickey) {
      res.status(404).json({message: 'missing publickey'})
  } else {
      var publickeypem=Buffer.from(req.headers.publickey,'base64').toString('ascii');
      var lines = publickeypem.split('\n');
      var publickeybase64 = '';
      for(var i = 0;i < lines.length;i++){
        if (lines[i].trim().length > 0 &&
            lines[i].indexOf('-BEGIN RSA PRIVATE KEY-') < 0 && 
            lines[i].indexOf('-BEGIN RSA PUBLIC KEY-') < 0 &&
            lines[i].indexOf('-BEGIN PUBLIC KEY-') < 0 &&
            lines[i].indexOf('-END PUBLIC KEY-') < 0 &&
            lines[i].indexOf('-END RSA PRIVATE KEY-') < 0 &&
            lines[i].indexOf('-END RSA PUBLIC KEY-') < 0) {
          publickeybase64 += lines[i].trim();
        }
      }
      var uuid=crypto.createHash('md5').update(publickeybase64,'base64').digest('hex');
      var publickey = crypto.createPublicKey(publickeypem)
      if (! req.headers.signature) {
          res.status(404).json({message: 'missing signature'})
      } else {
          var signaturebase64=req.headers.signature;
          if (! req.body.user) {
              res.status(404).json({message: 'missing user'})
          } else {
              var data=req.body.user
              const verifier = crypto.createVerify('sha256')
              verifier.update(data, 'ascii')
              if (! verifier.verify(publickey, signaturebase64,'base64')) {
                  res.status(403).json({message: 'verify failed'})
              } else {
                  hostModel.grantuser(uuid,data,function(err,data) {
                      if(err) {
                        console.log("hostController grantuser error "+ err);
                        res.status(500).json({error: err})
                      } else {
                        res.status(200).json({grant: 'OK'})
                      }
                  });
              }
          }
      }
   }
}

