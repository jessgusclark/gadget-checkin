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
	  		var _invisible = (count == 0) ? ' invisible' : '';

	  		return '<tr class="site ' + site.site + _invisible + '"><td class="site"><a href="https://a.cms.omniupdate.com/10/#oucampus/' + gadget.account + '/' + site.site + '/" target="_parent">' + site.site + '</a></td><td width="20%" class="count">' + count + ' files</td><td width="20%" class="button"></td></tr>';
	  	}

	}



	exports.sites = sites;

})(this);