var JiraApi = function(domain) {
	this.domain = domain
	this.jsonApiUrl = this.domain + "/rest/api/latest/";
}

JiraApi.getRandomString = function() {
	return Math.random().toString().substr(2);
}

JiraApi.getRandomFunction = function(callback) {
	var randomString = this.getRandomString();
	var functionName = "cb" + randomString;
	JiraApi[functionName] = function(data) {callback(data)};
	return "JiraApi." + functionName;
}

JiraApi.prototype.getProjects = function(callback) {
	this.getData(callback, "project")
}

JiraApi.prototype.getData = function(callback, type) {
	var randomFunctionName = JiraApi.getRandomFunction(callback);
	var callbackAppend = "?jsonp-callback=" + randomFunctionName;
	$.ajax({
		type: "GET",
		url: this.jsonApiUrl + "project" + callbackAppend,
		contentType: "application/javascript; charset=utf-8",
		dataType: "jsonp",
		success: function (data) { },
		error: function (errormessage) { }
	});
}