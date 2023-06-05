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

var RowKeyNum = 1; 

/* GET home page. */
router.get('/', function(req, res, next) {


    d=new Date() // Guns-2023-04-27 날짜변수 추가
    //var currentdate = d.getFullYear()+"-"+ d.getMonth() + 1 +"-"+ d.getDate()+" "+ d.getHours()+":"+ d.getMinutes()+":"+ d.getSeconds() // Guns-2023-04-27 날짜변수 추가
    var currentdate =  d.toISOString().slice(4,19).replace(/-/g,"");
    currentdate =  currentdate.replace(/:/g,"");
    
    var fullUrl = req.url; // Guns-2023-04-27 로깅을위한 변수설정
  
    // Guns-2023-04-27 Type1: 일반사이트 접속 시, Noti 화면 구성

    fullUrl = fullUrl.replace("/?","")
    var Domain = fullUrl.replace("http://","")
    Domain = Domain.replace("https://","")
    var idx = Domain.indexOf("/")
    if(idx >1){
      Domain = Domain.substring(0,idx)
    }

    var SendUserInfo = currentdate +"_" +String(RowKeyNum);

    try {
     
      if(Domain.length < 4 || (Domain == null )) 
      {
        //Do nothing 
      }
      else if (fullUrl.endsWith(".png") || fullUrl.endsWith(".gif") || fullUrl.endsWith(".jpg")) {
        console.log("이미지 파일임")
      }
      else{
      RowKeyNum = RowKeyNum + 1;
      /* Start Guns-2023-05-23 사용자 정보 불러오기*/ 

      

      dbFunc1_Insert("Access", currentdate, //tableName, ST_PartitionName
      SendUserInfo, //,ST_RowkeyName,
      String(req.header('User-Agent')), // ST_BrowserInfo,
      String(req.header('x-forwarded-for')), // ST_IPHeader,
      Domain, fullUrl) // ST_Domain,ST_FullUrl

      if (RowKeyNum > 10000000){
          RowKeyNum = 1;
        }
      
      }

    
    }
    catch(error) { // 에러로그 Azure Table에 반영

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
    /* End Guns-2023-05-23 사용자 정보 불러오기*/ 

    res.render('index', { reqUrl: fullUrl, reqDomain: Domain, reqUserInfo: SendUserInfo}); // Guns-2023-04-27 변수설정을 위한 코드 수정
   
});

module.exports = router;

 /* Start Guns-2023-05-18 Azure Storage Function
   tableName, ST_PartitionName(yyyymmdd), ST_RowkeyName (SeqNumber),ST_Description(ST_FullUrl),ST_BrowserInfo, ST_IPHeader, ST_Domain, 
 */  
function dbFunc1_Insert(tableName, ST_PartitionName,ST_RowkeyName,ST_BrowserInfo,ST_IPHeader,ST_Domain,ST_FullUrl) {
  try{
    const tableClient = new TableClient(
      endpoint,
      tableName,
      credential
      );
      
      const task = {
        partitionKey: ST_PartitionName, // yyyymmdd
        rowKey: ST_RowkeyName, // (SeqNumber)
        description: ST_FullUrl, // ST_FullUrl
        BrowserInfo : ST_BrowserInfo,
        IPHeader : ST_IPHeader,
        Domain : ST_Domain
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