var express = require('express');
var router = express.Router();

// 2023.05.18 Guns Azure Table Storage 상수 추가 https://learn.microsoft.com/ko-kr/azure/cosmos-db/table/how-to-use-nodejs
const { TableServiceClient, TableClient, AzureNamedKeyCredential, odata } = require("@azure/data-tables"); 
const endpoint = "https://desafelinkprdsa1.table.core.windows.net";
const credential = new AzureNamedKeyCredential(
  "desafelinkprdsa1",
  "KXlVbhjynESj1sWCbXjo6LovaXe/U+IxRjbqTdZNG9aKevqSZsxGcNHpTICx6oSnqGVFtT19lPgr+AStIXPzzQ=="
);
// 2023.05.18 Guns Azure Table Storage 상수 추가 https://learn.microsoft.com/ko-kr/azure/cosmos-db/table/how-to-use-nodejs

/* GET users listing. */
router.get('/', function(req, res, next) {

  // Guns-2023-06-05 Continue 로그 -- start
  var fullUrl_user = req.url; 
  try {
    res.send('respond with a resource' + fullUrl_user);
   

    d_user=new Date() // Guns-2023-04-27 날짜변수 추가
    var currentdate_user =  d_user.toISOString().slice(4,19).replace(/-/g,"");

    fullUrl_user = fullUrl_user.replace("/?","")
    console.log('fullUrl ==>' + fullUrl_user); // 
    var splitFullURL = fullUrl_user.split("_fu_"); //index.ejs에서 정보를 반영하기 위한
    console.log('splitFullURL[0] ==>' + splitFullURL[0]); // 
    console.log('splitFullURL[1] ==>' + splitFullURL[1]); // 
    
    dbFunc2_InsertContinue("Continue", currentdate_user, //tableName, ST_PartitionName
    splitFullURL[0], //,ST_RowkeyName,
    splitFullURL[1]) // ST_Descripion

  }
  catch(error) {
    if(error.length > 250){
      var reduceError = error.slice(0,200)
      dbFunc3_InsertError("Error",currentdate,//tableName, Err_PartitionName
      SendUserInfo, // Err_RowkeyName
      reduceError // Err_Descripion
      )
    }
    else{
      dbFunc3_InsertError("Error",currentdate,//tableName, Err_PartitionName
      SendUserInfo, // Err_RowkeyName
      error // Err_Descripion
      )
    }
  }
  // Guns-2023-06-05 Continue 로그 -- end


});

module.exports = router;

// 2023.05.26 Guns Continue 로그 추가
function dbFunc2_InsertContinue(tableName, ST_PartitionName,ST_RowkeyName, ST_Descripion) {
  try{
    const tableClient = new TableClient(
      endpoint,
      tableName,
      credential
      );
      
      const task = {
        partitionKey: ST_PartitionName,
        rowKey: ST_RowkeyName,
        description: ST_Descripion
      };
  
      let result = tableClient.createEntity(task);
  }
  catch(error) {
    console.log(error)
  }
}

function dbFunc3_InsertError(tableName, Err_PartitionName,Err_RowkeyName, Err_Descripion) {
  try{
    const tableClient = new TableClient(
      endpoint,
      tableName,
      credential
      );
      
      const task = {
        partitionKey: Err_PartitionName,
        rowKey: Err_RowkeyName,
        description: Err_Descripion
      };
  
      let result = tableClient.createEntity(task);
  }
  catch(error) {
    console.log(error)
  }
}