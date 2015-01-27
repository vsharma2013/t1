
var fs = require('fs');
var connStr = 'mongodb://192.168.50.213:27017/db1';
var mongoClient = require('mongodb').MongoClient;
var dbHandle = null;
var env = require('jsdom').env;
var rootDir = 'https://www.valueresearchonline.com/funds/newsnapshot.asp?schemecode=';
var htmlFiles = ['10563',  '11463',  '2142',  '2599',  '2645',  '3019',  '3087',  '5069',  '6778'];

function processHTML(htmlFileName, cbOnDone){
  env(htmlFileName, function(errors, window){
    onHtmlLoad(errors, window, htmlFileName, cbOnDone)
  });
}

function onHtmlLoad(errors, window,htmlFileName, cbOnDone){
  var $ = require('jquery')(window);
  var $cols1 = $(".margin_top15px table").last().find("td.align_right");
  var $cols2 = $(".margin_top15px table").last().find("a");

  var vals1 = [];
  $.each($cols1, function(i,c){   vals1.push($(c).text()) });
  var vals2 = [];
  $.each($cols2, function(i,c){ vals2.push($(c).text()) });

  var jVals1 = [];
  for(var i = 0 ; i < vals1.length; i+=4){
    var obj = {
      fileName : htmlFileName,
      pe : parseFloat(vals1[i]),
      high3yr : parseFloat(vals1[i+1]),
      low3yr : parseFloat(vals1[i+2]),
      percentAssets : parseFloat(vals1[i+3])    
    }
    jVals1.push(obj);
  }
  var j = 0;
  for(var i = 0 ; i < jVals1.length ; i++){
    jVals1[i].company = vals2[j]; j++;
    jVals1[i].sector = vals2[j]; j++;
  }
  cbOnDone(jVals1);
}

var allData = [];
var processedCount = 0;

function onHtmlProcessed(data){
    allData = allData.concat(data);
    processedCount++;
    console.log('Processed count : ' +  processedCount);
    if(processedCount >= htmlFiles.length){
      addRecordsToDb();
    }
}

htmlFiles.forEach(function(htmlFile) {
    processHTML(rootDir + htmlFile, onHtmlProcessed);
});

function addRecordsToDb(){
  mongoClient.connect(connStr, function(err, db){
    if(err) {
      console.log(err);
      return;
    }
    dbHandle = db;
    insertRecords(allData);
  });
}

function insertRecords(records){
  dbHandle.collection('valueResearch').insert(records, {safe:true}, function(err, result){
    if(err){
      console.log(err);
      return ;
    }
    else{
      console.log('RecordsAddedecords added successfully count = ' + records.length);
    }
  });
}