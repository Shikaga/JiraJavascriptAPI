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
	JiraApi[functionName] = function(data) {
		delete window["JiraApi"][functionName];
		callback(data)
	};
	return "JiraApi." + functionName;
}

JiraApi.prototype.getProjects = function(callback) {
	this.getData(callback, "project")
}

JiraApi.prototype.getVersions = function(callback, project) {
	var uriSuffix = "project/" + project + "/versions";
	this.getData(callback, uriSuffix)
}

JiraApi.prototype.getVersion = function(callback, project, fixVersionId) {
	//https://jira.secondlife.com/rest/api/latest/search?
	// jsonp-callback=_jiraProcessData_X
	// &fields=key&
	var uriSuffix = "search?jql=project=" + project + "+AND+fixversion=" + fixVersionId + "&maxResults=1000";
	this.getData(callback, uriSuffix)
}

JiraApi.prototype.getIssue = function(callback, issue) {
	var uriSuffix = "issue/" + issue;
	this.getData(callback, uriSuffix)
}

JiraApi.prototype.getData = function(callback, type) {
	var randomFunctionName = JiraApi.getRandomFunction(callback);
	if (type.indexOf("?") == -1) {
		var callbackAppend = "?jsonp-callback=" + randomFunctionName;
	} else {
		var callbackAppend = "&jsonp-callback=" + randomFunctionName;
	}
	$.ajax({
		type: "GET",
		url: this.jsonApiUrl + type + callbackAppend,
		contentType: "application/javascript; charset=utf-8",
		dataType: "jsonp",
		success: function (data) { },
		error: function (errormessage) { }
	});
}