
var fs = require('fs');
var mongoClient = require('mongodb').MongoClient;
var env = require('jsdom').env;

function CrawlApp(){
  this.dbConnString = 'mongodb://192.168.50.213:27017/db1';
  this.dbHandle = null;
  this.targetRootUrl = 'https://www.valueresearchonline.com/funds/newsnapshot.asp?schemecode=';
  this.targetIDs = ['10563',  '11463',  '2142',  '2599',  '2645',  '3019',  '3087',  '5069',  '6778'];
  this.allData = [];
  this.processedCount = 0;
}

CrawlApp.prototype.run = function(){
  this.targetIDs.forEach((function(id){
    var targetUrl = this.targetRootUrl + id;
    this.processUrl(targetUrl);
  }).bind(this));
}

CrawlApp.prototype.processUrl = function(targetUrl){
  env(targetUrl, (function(errors, window){
    this.onUrlResponse(errors, window, targetUrl)
  }).bind(this));
}

CrawlApp.prototype.onUrlResponse = function(errors, window, targetUrl){
  var $ = require('jquery')(window);
  var $cols1 = $(".margin_top15px table").last().find("td.align_right");
  var $cols2 = $(".margin_top15px table").last().find("a");

  var vals1 = [];
  $.each($cols1, function(i,c){   vals1.push($(c).text()) });
  var vals2 = [];
  $.each($cols2, function(i,c){   vals2.push($(c).text()) });

  var jVals1 = [];
  for(var i = 0 ; i < vals1.length; i+=4){
    var obj = {
      url           : targetUrl,
      pe            : parseFloat(vals1[i]),
      high3yr       : parseFloat(vals1[i+1]),
      low3yr        : parseFloat(vals1[i+2]),
      percentAssets : parseFloat(vals1[i+3])    
    }
    jVals1.push(obj);
  }
  var j = 0;
  for(var i = 0 ; i < jVals1.length ; i++){
    jVals1[i].company = vals2[j]; j++;
    jVals1[i].sector = vals2[j]; j++;
  }
  this.onPostUrlProcess(jVals1);  
}

CrawlApp.prototype.onPostUrlProcess = function(dataArray){
  this.allData = this.allData.concat(dataArray);
  this.processedCount++;
  console.log('Processed count : ' +  this.processedCount);
  if(this.processedCount >= this.targetIDs.length){
    this.addRecordsToDb();
  }  
}

CrawlApp.prototype.addRecordsToDb = function(){
  mongoClient.connect(this.dbConnString, (function(err, db){
    if(err) {
      console.log(err);
      return;
    }
    this.dbHandle = db;
    this.insertRecords();
  }).bind(this));
}

CrawlApp.prototype.insertRecords = function(){
  var records = this.allData;
  this.dbHandle.collection('valueResearch').insert(records, {safe:true}, function(err, result){
    if(err){
      console.log(err);
      return ;
    }
    else{
      console.log('Added successfully count = ' + records.length);
    }
  });
}


var crawlApp = new CrawlApp();
crawlApp.run();