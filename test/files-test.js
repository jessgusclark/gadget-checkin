var jsdom = require("jsdom").jsdom;
var sinon = require('sinon');

global.window = jsdom().defaultView;
global.jQuery = global.$ = require("jquery"); 


var assert = require('chai').assert;
var app = require('../source/js/files.js');

var sandbox;
beforeEach(function(){
	this.sinon = sandbox = sinon.sandbox.create();
});

afterEach(function() {
	sandbox.restore();
});

global.gadget = {account : "TEST"}

	describe('test sites', function() {

		it('should pull list of files data from stub', function(){
		
			// a reduced sample response from ou campus:
			var staticResponse = [{"site":"www","path":"/about-insight/insight_report_development.pcf","name":"insight_report_development.pcf","asset_type":"","type":"pcf","locked_time":"2018-04-26T15:15:39Z","locked_time_format":"4/26/18 9:15 AM","locked_by":"jesse.clark","saved_time":"2016-09-09T15:48:30Z","saved_time_format":"9/9/16 9:48 AM","is_scheduled_to_publish":false,"is_scheduled_to_expire":false,"pending_approval":false}]


			// stub the a.jax call:
			this.sinon.stub($, "ajax").returns($.Deferred().resolve( staticResponse ));

			app.files.getFiles().done(function(data){
				assert.equal("www", data[0].site);
				assert.equal("/about-insight/insight_report_development.pcf", data[0].path);
			});

		});

		it('should ignore files that are scheduled, expired and underworkflow', function(){

			var sampleData = [
				{"is_scheduled_to_publish":true,"is_scheduled_to_expire":false,"pending_approval":false},
				{"is_scheduled_to_publish":false,"is_scheduled_to_expire":true,"pending_approval":false},
				{"is_scheduled_to_publish":false,"is_scheduled_to_expire":false,"pending_approval":true},
				{"is_scheduled_to_publish":false,"is_scheduled_to_expire":false,"pending_approval":false}
			];

			assert.equal(1, app.files.getActiveFiles(sampleData).length );

		});

});