var async = require('async');

function runWaterfall(){
	var arrWaterfallFunctions = [
		                          execA,
		                          execB,
		                          execC
		                        ];
	async.waterfall(arrWaterfallFunctions, onEnd);	
}

function execA(cbToB){
	console.log("Executed A");
	cbToB(null, "From A");
}

function execB(arg1, cbToC){
	console.log(arguments);
	console.log("Executed B");
	cbToC(null, "From B");
}

function execC(arg1, cbToEnd){
	console.log(arguments);
	console.log("Executed C");
	cbToEnd(null, "From C");
}

function onEnd(err, result){
	console.log(arguments);
	console.log("Executed all ***");
}

function onError(err, result){
	console.log("Error in processing  "  + err);
}

runWaterfall();


function RequestProcessor(){
	this.dataReceived = false;
}

RequestProcessor.prototype.processRequest = function(requestParams){
	someModule.requestForData(requestParams, this.onDataResponse.bind(this));
}

RequestProcessor.prototype.onDataResponse = function(responseData){
	this.dataReceived = true;
	console.log(responseData);
}

AccountUtils.prototype.empty = function(){
}

AccountUtils.prototype.reportABTestingEvent = function(){
}

module.exports = AccountUtils;

function outer(err, params){
	console.log(err);
	console.log(params);
	
	function inner(err, params){
		console.log(err);
		console.log(params);
	}
	
	inner('from inner', {key : "INNER"});
}

outer('from outer', {key: "OUTER"})
