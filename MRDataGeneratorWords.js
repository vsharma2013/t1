var batchCount = 100;   //max 1000
var batchRepeat = 1000; //max 10000

var wordsInDictonary = 15;
var dictonary = [];
var wordsAdded = 0;

var connStr = 'mongodb://localhost:27017/db1';
var mongoClient = require('mongodb').MongoClient;
var dbHandle = null;



function randomUUID(){return("0000"+(Math.random()*Math.pow(36,4)<<0).toString(36)).slice(-4)
};

function getRandomNumberInRange(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

for (var i = 0; i < wordsInDictonary; i++) {
	dictonary.push('word' + (i+1));
};

mongoClient.connect(connStr, function(err, db){
	if(err) {
		console.log(err);
		return;
	}
	dbHandle = db;
	insertRecords();
});

function insertToDb(words, cbOnInserComplete){
	dbHandle.collection('words').insert(words, {safe:true}, function(err, result){
		if(err){
			console.log(err);
			return ;
		}
		else{
			wordsAdded += words.length;
			console.log('RecordsAddedecords added successfully count = ' + wordsAdded);
			cbOnInserComplete();
		}
	});
}

function insertRecords(){
	var words = [];
	for (var i = 0; i < batchCount; i++) {
		var word = {
			id     : randomUUID(),
			value         : dictonary[getRandomNumberInRange(0, wordsInDictonary)]
		};
		words.push(word);
	};

	insertToDb(words, function(){
		if(wordsAdded < (batchCount * batchRepeat))	{
			insertRecords();
		}
		
	});
}