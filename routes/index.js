var express = require('express');
var router = express.Router();
var azure = require('azure-storage'); // Guns-2023-05-17 데이터베이스 연결을 위한 변수 추가
var tableSvc = azure.createTableService('desafelinkprdsa1','KXlVbhjynESj1sWCbXjo6LovaXe/U+IxRjbqTdZNG9aKevqSZsxGcNHpTICx6oSnqGVFtT19lPgr+AStIXPzzQ=='); // Guns-2023-05-17 데이터베이스 연결을 위한 변수 추가

var url = require('url'); // Guns-2023-04-27 변수설정을 위한 코드 수정
const todayFullMonth = (new Date().getFullYear())*12 + new Date().getMonth()

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

  /* Start Guns-2023-05-17 사용자 정보 불러오기*/ 
  d=new Date()
  var currentdate = d.getFullYear()+"-"+ d.getMonth() +"-"+ d.getDate()+" "+ d.getHours()+":"+ d.getMinutes()+":"+ d.getSeconds()
  
  try {
    
      const ip = req.headers['x-forwarded-for'];
      dbFunc1_Insert("Access", currentdate ,Domain,req.acceptedLanguages, ip)
  
  }
    catch(error) {
      dbFunc1_Insert("Access", currentdate ,"Error",error,"gunsoo.jang@doosan.com" )
    // Error: someError
  }
  
  /* End Guns-2023-05-17 사용자 정보 불러오기*/ 

  //res.render('index', { title: 'Express' }); // Guns-2023-04-27 수정 전 코드
  res.render('index', { reqUrl: fullUrl, reqDomain: Domain}); // Guns-2023-04-27 변수설정을 위한 코드 수정
});

module.exports = router;


 /* Start Guns-2023-05-17 Azure Storage Function*/  
function dbFunc1_Insert(tableName, PartitionName,RowkeyName,KeyName,Info) {

  var entGen = azure.TableUtilities.entityGenerator;
  var task = {
     PartitionKey: entGen.String(PartitionName),
     RowKey: entGen.String(RowkeyName),
     description: entGen.String(KeyName),
     Info: entGen.String(Info),
  };
  
  
  
  tableSvc.insertEntity(tableName,task, function (error, result, response) {
  if(!error){
   // Entity inserted
   }
  });
  
  }

   /* End Guns-2023-05-17 Azure Storage Function*/  