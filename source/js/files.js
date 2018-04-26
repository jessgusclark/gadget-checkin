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
	  	},
	  	getActiveFiles : function(pages){
	  		var activeFiles = [];

	  		$.each(pages, function(key, value) {

	  			if (!value.is_scheduled_to_publish && 
	  				!value.is_scheduled_to_expire && 
	  				!value.pending_approval){
		  				
		  				activeFiles.push(value);

		  		}
	  		});

	  		return activeFiles;
	  	}

	}

	exports.files = files;

})(this);