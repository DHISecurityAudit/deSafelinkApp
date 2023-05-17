var express = require('express');
var router = express.Router();

var url = require('url'); // Guns-2023-04-27 변수설정을 위한 코드 수정*/


/* GET home page. */
router.get('/', function(req, res, next) {

  /* Start Guns-2023-04-27 변수설정을 위한 코드 수정*/
  var fullUrl = req.url;
  fullUrl = fullUrl.replace("/?","")
  var Domain = fullUrl.replace("http://","")
  Domain = Domain.replace("https://","")
  var idx = Domain.indexOf("/")
  if(idx >1){
    Domain = Domain.substring(0,idx)
  }
  /* End Guns-2023-04-27 변수설정을 위한 코드 수정*/  


  //res.render('index', { title: 'Express' }); // Guns-2023-04-27 수정 전 코드
  res.render('index', { reqUrl: fullUrl, reqDomain: Domain}); // Guns-2023-04-27 변수설정을 위한 코드 수정
});

module.exports = router;