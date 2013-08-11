QUnit.module('JiraApi Tests', {
	setup: function() {
		//sinon.spy(jQuery, "ajax");
		twoProjects = [{"self":"https://jira.secondlife.com/rest/api/2/project/ARVD","id":"10110","key":"ARVD","name":"Archived","avatarUrls":{"16x16":"https://jira.secondlife.com/secure/projectavatar?size=small&pid=10110&avatarId=10011","48x48":"https://jira.secondlife.com/secure/projectavatar?pid=10110&avatarId=10011"}},
			{"self":"https://jira.secondlife.com/rest/api/2/project/MATBUG","id":"11017","key":"MATBUG","name":"Materials Project Viewer Bugs","avatarUrls":{"16x16":"https://jira.secondlife.com/secure/projectavatar?size=small&pid=11017&avatarId=10011","48x48":"https://jira.secondlife.com/secure/projectavatar?pid=11017&avatarId=10011"}}];

		threeVersions = [{"self":"https://jira.secondlife.com/rest/api/latest/version/10451","id":"10451","description":"Any of these issues that are applicable will be addressed in the Snowstorm project.","name":"Snowglobe mysterious future","archived":false,"released":false},
			{"self":"https://jira.secondlife.com/rest/api/latest/version/10571","id":"10571","description":"Viewer 2.0 rebase of Snowglobe; beta versions available, but no release will be produced.","name":"Snowglobe 2.0","archived":false,"released":false},
			{"self":"https://jira.secondlife.com/rest/api/latest/version/10713","id":"10713","name":"Snowglobe 1.5","archived":false,"released":false}]
		jQuery.ajax = sinon.spy();
	},
	teardown: function() {
		//jQuery.ajax.restore(); // Unwraps the spy
	}
});

asyncTest("requests projects when invoked", function() {
	expect(5);
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
	expect(5);
	var sprints = undefined;

	var ja = new JiraApi("https://jira.secondlife.com");
	ja.getVersions(function(data) {sprints = data}, "SNOW");
	assertDataRequested("https://jira.secondlife.com/rest/api/latest/project/SNOW/versions");

	setTimeout(function() {
		callbackData(threeVersions);
		equal(3,sprints.length, "Correct number of versions")
		start();
	},0);
});

asyncTest("requests sprint when invoked", function() {
	//https://jira.secondlife.com/rest/api/latest/search?
	// jsonp-callback=_jiraProcessData_X&fields=key&
	// jql=project%3DSNOW+AND+fixversion%3D10571
	// &maxResults=1000
	expect(8);
	var sprintIssues = undefined;

	var ja = new JiraApi("https://jira.secondlife.com");
	ja.getVersion(function(data) {sprintIssues = data}, "SNOW", "10571");
	assertDataRequested("project=SNOW");
	assertDataRequested("fixversion=10571");

	setTimeout(function() {
		callbackData(threeVersions);
		equal(3,sprintIssues.length, "Correct number of issues")
		start();
	},0);
});



function callbackData(data) {
	var requestedUrl = jQuery.ajax.getCall(0).args[0].url;
	var method = getParameterByName(requestedUrl, "jsonp-callback");
	var objectPathArray = method.split(".");
	var callback = window[objectPathArray[0]][objectPathArray[1]];
	callback(data);
	equal(window[objectPathArray[0]][objectPathArray[1]], undefined, "The callback function is cleaned up")
	return callback;
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
