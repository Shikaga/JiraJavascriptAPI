QUnit.module('JiraApi Tests', {
	setup: function() {
		//sinon.spy(jQuery, "ajax");
		twoProjects = [{"self":"https://jira.secondlife.com/rest/api/2/project/ARVD","id":"10110","key":"ARVD","name":"Archived","avatarUrls":{"16x16":"https://jira.secondlife.com/secure/projectavatar?size=small&pid=10110&avatarId=10011","48x48":"https://jira.secondlife.com/secure/projectavatar?pid=10110&avatarId=10011"}},
			{"self":"https://jira.secondlife.com/rest/api/2/project/MATBUG","id":"11017","key":"MATBUG","name":"Materials Project Viewer Bugs","avatarUrls":{"16x16":"https://jira.secondlife.com/secure/projectavatar?size=small&pid=11017&avatarId=10011","48x48":"https://jira.secondlife.com/secure/projectavatar?pid=11017&avatarId=10011"}}];
		jQuery.ajax = sinon.spy();
	},
	teardown: function() {
		//jQuery.ajax.restore(); // Unwraps the spy
	}
});

asyncTest("requests projects when invoked", function() {
	expect(4);
	var projects = undefined;

	var ja = new JiraApi("https://jira.secondlife.com");
	ja.getProjects(function(data) {projects = data});
	assertDataRequested("https://jira.secondlife.com/rest/api/latest/project");

	setTimeout(function() {
		callbackData(twoProjects);
		equal(2,projects.length, "Correct number of projects")
		start();
	},0);
});

asyncTest("requests sprints when invoked", function() {
	expect(4);
	var sprints = undefined;

	var ja = new JiraApi("https://jira.secondlife.com");
	ja.getSprints(function(data) {sprints = data}, "ARVD");
	assertDataRequested("https://jira.secondlife.com/rest/api/latest/project");

	setTimeout(function() {
		callbackData([]);
		equal(0,sprints.length, "Correct number of sprints")
		//start();
	},0);
});

//TODO: Make sue that functions are deleted! delete window[callbackName];



function callbackData(data) {
	var requestedUrl = jQuery.ajax.getCall(0).args[0].url;
	var method = getParameterByName(requestedUrl, "jsonp-callback");
	var objectPathArray = method.split(".");
	window[objectPathArray[0]][objectPathArray[1]](data);
}

function assertDataRequested(uri) {
	ok(jQuery.ajax.calledOnce, "Data requested");
	ok(jQuery.ajax.getCall(0).args[0].url.indexOf(uri) !== -1,
		"Correct URI requested");
	equal("jsonp", jQuery.ajax.getCall(0).args[0].dataType, "JSONP dataType used");
}

function getParameterByName(url, name) {
	name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(url);
	return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
