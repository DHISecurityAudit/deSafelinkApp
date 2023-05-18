var express = require('express');
var router = express.Router();

// 2023.05.18 Guns Azure Table Storage 상수 추가 https://learn.microsoft.com/ko-kr/azure/cosmos-db/table/how-to-use-nodejs
const { TableServiceClient, TableClient, AzureNamedKeyCredential, odata } = require("@azure/data-tables"); 
const endpoint = "https://desafelinkprdsa1.table.core.windows.net/Access";
const credential = new AzureNamedKeyCredential(
  "desafelinkprdsa1",
  "KXlVbhjynESj1sWCbXjo6LovaXe/U+IxRjbqTdZNG9aKevqSZsxGcNHpTICx6oSnqGVFtT19lPgr+AStIXPzzQ=="
);
// 2023.05.18 Guns Azure Table Storage 상수 추가 https://learn.microsoft.com/ko-kr/azure/cosmos-db/table/how-to-use-nodejs

var url = require('url'); // Guns-2023-04-27 변수설정을 위한 코드 수정
const todayFullMonth = (new Date().getFullYear())*12 + new Date().getMonth() // 현재 날짜 기록 관리

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
    dbFunc1_Insert("Access", currentdate ,Domain,req.ip,"gunsoo.jang@doosan.com" )
  }
    catch(error) {

      dbFunc1_Insert("Access", currentdate ,"Error",error.substring(1,200),"gunsoo.jang@doosan.com" )
    // Error: someError
  }
  
  /* End Guns-2023-05-17 사용자 정보 불러오기*/ 

  //res.render('index', { title: 'Express' }); // Guns-2023-04-27 수정 전 코드
  res.render('index', { reqUrl: fullUrl, reqDomain: Domain}); // Guns-2023-04-27 변수설정을 위한 코드 수정
});

module.exports = router;

 /* Start Guns-2023-05-18 Azure Storage Function*/  
function dbFunc1_Insert(tableName, ST_PartitionName,ST_RowkeyName,ST_Description,ST_Info) {

  const tableClient = new TableClient(
    endpoint,
    tableName,
    credential
    );
    
    const task = {
      partitionKey: ST_PartitionName,
      rowKey: ST_RowkeyName,
      description: ST_Description,
      Info: ST_Info
    };

    let result = tableClient.createEntity(task);
  }
  /*
  var entGen = azure.TableUtilities.entityGenerator;
  var task = {
     PartitionKey: entGen.String(PartitionName),
     RowKey: entGen.String(RowkeyName),
     description: entGen.String(KeyName),
     Info: entGen.String(Info),
  };
  */
  

   /* End Guns-2023-05-18 Azure Storage Function*/  