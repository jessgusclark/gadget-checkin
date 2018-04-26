(function(exports) {
	"use strict";

	//public functions:
	var files = {

		getFiles : function(site){
			var deferred = $.Deferred();

	  		var data = {
	  			"authorization_token" : gadget.token,
	  			"site" : site
	  		}
	  		
	  		$.ajax({
				dataType: "json",
				url: gadget.apihost + "/files/checkedout",
				data: data
			}).done(function(data){
				//console.log("/files/checkedout success", data);
				deferred.resolve(data);
			}).fail(function(err){
				console.log("/files/checkedout error", err);
			});

			return deferred.promise();
	  	}

	}

	exports.files = files;

})(this);