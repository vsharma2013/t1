
var vr = require('./data.js');
var connStr = 'mongodb://localhost:27017/db1';
var mongoClient = require('mongodb').MongoClient;
var dbHandle = null;
console.log(vr);

mongoClient.connect(connStr, function(err, db){
	if(err) {
		console.log(err);
		return;
	}
	dbHandle = db;
	insertRecords(vr);
});

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

