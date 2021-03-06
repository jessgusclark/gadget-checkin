var jsdom = require("jsdom").jsdom;
var sinon = require('sinon');

global.window = jsdom().defaultView;
global.jQuery = global.$ = require("jquery"); 


var assert = require('chai').assert;
var app = require('../source/js/sites.js');

global.gadget = {account : "TEST"}

var sandbox;
beforeEach(function(){
	this.sinon = sandbox = sinon.sandbox.create();
});

afterEach(function() {
	sandbox.restore();
});

describe('test sites', function() {

	it('should pull list of sites data from stub', function(){
	
		// a reduced sample response from ou campus:
		var staticResponse = [{"site":"www"},{"site":"arts"}]

		// stub the a.jax call:
		this.sinon.stub($, "ajax").returns($.Deferred().resolve( staticResponse ));

		app.sites.getSites().done(function(data){
			assert.equal("www", data[0].site);
		});

	});

	it('should sort the sites based on the site name', function(){

		var sampleData = [{"site":"mcb"},{"site":"www"},{"site":"arts"}]
		var sortedData = app.sites.sortData(sampleData);

		assert.equal( "arts", sortedData[0].site );
		assert.equal( "mcb", sortedData[1].site );

	});

	it('should return a table row with formatted content', function(){
		// expected site www, account TEST
		var expected = '<tr class="site www"><td class="site"><a href="https://a.cms.omniupdate.com/10/#oucampus/TEST/www/" target="_parent">www</a></td><td width="20%" class="count"></td><td width="20%" class="button"></td></tr>';

		var site = {"site":"www"}
		
		assert.equal(expected, app.sites.createTableRow(site));

	});


});