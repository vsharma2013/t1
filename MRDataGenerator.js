
var articles = [];
var days = [];
var months = [];
var years = [2010, 2011, 2012, 2013, 2014];
var salesPersons = [];
var cities = [];

var articleCount = 3;
var salesPersonCount = 3;
var cityCount = 5;

var connStr = 'mongodb://localhost:27017/db1';
var mongoClient = require('mongodb').MongoClient;
var dbHandle = null;
var batchCount = 100;   //max 1000
var batchRepeat = 1; //max 10000
var recordsAdded = 0;

for (var i = 0; i < 31; i++) {
	days.push(i+1);
};

for (var i = 0; i < 12; i++) {
	months.push(i+1);
};


for (var i = 0; i < articleCount; i++) {
	articles.push('Article' + (i+1));
};

for (var i = 0; i < salesPersonCount; i++) {
	salesPersons.push('SP' + (i+1));
};

for (var i = 0; i < cityCount; i++) {
	cities.push('City' + (i+1));
};


function getRandomNumberInRange(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}




mongoClient.connect(connStr, function(err, db){
	if(err) {
		console.log(err);
		return;
	}
	dbHandle = db;
	insertRecords();
});

function insertToDbBulk(salesRecords, cbOnInserComplete){
	var bulk = dbHandle.collection('salesRecords').initializeUnorderedBulkOp();
	for (var i = 0; i < salesRecords.length; i++) {
		bulk.insert(salesRecords[i]);
	};
	bulk.execute( { w: "majority", wtimeout: 5000 } );
		
	recordsAdded += salesRecords.length;
	console.log('RecordsAddedecords added successfully count = ' + recordsAdded);
	cbOnInserComplete();
}

function insertToDb(salesRecords, cbOnInserComplete){
	dbHandle.collection('salesRecords').insert(salesRecords, {safe:true}, function(err, result){
		if(err){
			console.log(err);
			return ;
		}
		else{
			recordsAdded += salesRecords.length;
			console.log('RecordsAddedecords added successfully count = ' + recordsAdded);
			cbOnInserComplete();
		}
	});
}

function insertRecords(){
	var salesRecords = [];
	for (var i = 0; i < batchCount; i++) {
		var salesRec = {
			article     : articles[getRandomNumberInRange(0, articleCount)],
			day         : days[getRandomNumberInRange(0, 31)],
			month       : months[getRandomNumberInRange(0,12)],
			year        : years[getRandomNumberInRange(0,5)],
			salesPerson : salesPersons[getRandomNumberInRange(0, salesPersonCount)],
			city        : cities[getRandomNumberInRange(0, cityCount)]
		};
		salesRecords.push(salesRec);
	};

	insertToDb(salesRecords, function(){
		if(recordsAdded < (batchCount * batchRepeat))	{
			insertRecords();
		}
		
	});
}


