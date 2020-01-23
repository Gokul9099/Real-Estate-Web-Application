var express = require('express');
var router = express.Router();

router.get('/',function(req,res){
  var path = process.cwd();
  //res.sendFile(path + '/views/index');
  if(req.session.count === undefined){
      res.render("index",{count:0});
    }
    else{
      res.render("index",{count : req.session.count});
    }
});

module.exports = router;
