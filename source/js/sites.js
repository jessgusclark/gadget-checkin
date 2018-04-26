(function(exports) {
	"use strict";

	//public functions:
	var sites = {

		getSites : function(){
			var deferred = $.Deferred();

	  		var data = {
	  			"authorization_token" : gadget.token
	  		}
	  		
	  		$.ajax({
				dataType: "json",
				url: gadget.apihost + "/sites/list",
				data: data
			}).done(function(data){
				//console.log("sites success", data);
				deferred.resolve(data);
			}).fail(function(err){
				console.log("/sites/list error", err);
			});

			return deferred.promise();
	  	},

	  	/*
	  	 * Sort json array.
		 * Docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
	  	 */
	  	sortData: function(data){

	  		var sorted = data.sort(function(a, b) {
			    //return a.site - b.site;
			    var siteA = a.site.toUpperCase(); // ignore upper and lowercase
				var siteB = b.site.toUpperCase(); // ignore upper and lowercase
				if (siteA < siteB) {
					return -1;
				}
				if (siteA > siteB) {
				    return 1;
				}
				// names must be equal
				return 0;
			});

	  		return sorted;
	  	},

	  	createTableRow : function(site, count){
	  		var _invisible = (count == 0) ? ' invisible' : '';

	  		return '<tr class="site ' + site.site + _invisible + '"><td class="site"><a href="https://a.cms.omniupdate.com/10/#oucampus/' + gadget.account + '/' + site.site + '/" target="_parent">' + site.site + '</a></td><td width="20%" class="count">' + count + ' files</td><td width="20%" class="button"></td></tr>';
	  	}

	}


	/*function sortObjectKeys(obj){
	    return Object.keys(obj).sort().reduce((acc,key)=>{
	        acc[key]=obj[key];
	        return acc;
	    },{});
	}*/

	exports.sites = sites;

})(this);