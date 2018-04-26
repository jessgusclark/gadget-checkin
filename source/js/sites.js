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

	  	createTableRow : function(site, count){
	  		
	  		return '<tr class="site ' + site.site + '"><td class="site"><a href="https://a.cms.omniupdate.com/10/#oucampus/' + gadget.account + '/' + site.site + '/" target="_parent">' + site.site + '</a></td><td class="count">' + count + ' files</td><td><a class="btn btn-default btn-sm check-in pull-right">Check In</a></td></tr>';
	  	}
	}

	exports.sites = sites;

})(this);