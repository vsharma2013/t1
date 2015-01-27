var async = require('async');
var http = require('http');

function runSeries(){
	var arrSeriesFunctions = [
	                            execA,
	                            execB,
	                            execC
	                         ];
	async.series(arrSeriesFunctions, onEnd);
}

function execA(cbToB){
	console.log("Executed A");
	cbToB(null, "From A");
}

function execB(cbToC){
	console.log("Executed B");
	cbToC(null, "From B");
}

function execC(cbToEnd){
	console.log("Executed C");
	cbToEnd(null, "From C");
}

function onEnd(err, result){
	console.log(result);
	console.log("Executed all ***");
}

function onError(err, result){
	console.log("Error in processing  "  + err);
}



http.createServer(function(req, res){
	runSeries();
	res.end("Done");
}).listen(8080);