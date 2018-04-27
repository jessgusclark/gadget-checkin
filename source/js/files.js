(function(exports) {
	"use strict";

	//public functions:
	var files = {

		getFiles : function(_site){
			var deferred = $.Deferred();

	  		var data = {
	  			"authorization_token" : gadget.token,
	  			"site" : _site
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
	  	getActiveFiles : function(_pages){
	  		var activeFiles = [];

	  		$.each(_pages, function(key, value) {

	  			if (!value.is_scheduled_to_publish && 
	  				!value.is_scheduled_to_expire && 
	  				!value.pending_approval){
		  				
		  				activeFiles.push(value);

		  		}
	  		});

	  		return activeFiles;
	  	},

	  	checkInFiles : function(_files){

	  		$.each(_files, function(key, value) {
	  			console.log("file", value.site, value.path);
	  			checkInIndividualFile(value);
	  		});

	  	}
	}


	function checkInIndividualFile(_file) {

  		var deferred = $.Deferred();

  		var data = {
  			"authorization_token" : gadget.token,
  			"site" : _file.site,
  			"path" : _file.path
  		}
  		
  		$.ajax({
			dataType: "json",
			url: gadget.apihost + "/files/checkin",
			data: data,
			type: "POST"
		}).done(function(data){
			console.log("file checked in:", _file.path);
			deferred.resolve(true);
		}).fail(function(err){
			console.log("/files/checkedout error", err);
			deferred.resolve(false);
		});

		return deferred.promise();

  	}

	exports.files = files;

})(this);