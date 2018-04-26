$(document).ready(function () {
    /* 
        First, call `gadget.ready()` to make sure the gadget has obtained an API token
        to use for making OU Campus API calls. If your gadget will not make any API calls,
        you can dispense with this method. This asynchronous method returns a jQuery
        Promise object.
        
        Then, call `gadget.fetch()` to get the gadget's config data from the system. This
        method, which also returns a jQuery Promise object, uses the API, which is why it
        needs to follow the call to `gadget.ready()`.
        
        If you don't need the config data, you don't need to call gadget.fetch().
    */
    var apihost;
    var token;

    var checkedOutContent = [];

    // global vars:
    gadget.ready().then(gadget.fetch).then(function () {
       
       //set variables:
        apihost = gadget.get('apihost');
        token = gadget.get('token');        

        console.log("Gadget Ready!");

        // get list of sites:
        $.when( sites.getSites() ).done(function(data) {
            
            // format list of sites on the HTML:
            $.each(data, function(key, value) {

                // get list of checkout files for each site:
                $.when( files.getFiles(value.site) ).done(function(data) {

                    var _active = files.getActiveFiles(data);
                    var _html = $(sites.createTableRow( value, _active.length ) );
                    var $checkInButton = $('<a/>').attr({ class: 'btn btn-outline-info float-right'}).html('Check In');
                    
                    //add click event:
                    $checkInButton.on('click', function(){
                        files.checkInFiles(_active);
                    });

                    $(_html).find('.button').append( $checkInButton );
                    $("#checkedOut tbody").append( _html );

                });

            });

        });

    });

    


    function addDirectoryContentToTable(entries, getSite){

        checkedOutContent["everyone-content"] = [];
        checkedOutContent["user-content"] = [];

        for (i = 0; i < entries.length; i++) {
            
            if (entries[i].locked_by != null){
                
                // format equal to the site:
                var tempObject = {
                    site: getSite,
                    path: entries[i].staging_path
                }

                if (isAdmin){
                    checkedOutContent["everyone-content"].push(tempObject);
                }

                if (entries[i].locked_by === gadget.get('user') ){
                    checkedOutContent["user-content"].push(tempObject);
                }

            }
        }

        $(".everyone-content").find("td.count").text(checkedOutContent["everyone-content"].length);
        $(".user-content").find("td.count").text(checkedOutContent["user-content"].length);

        checkLength(".everyone-content", checkedOutContent["everyone-content"].length);
        checkLength(".user-content", checkedOutContent["user-content"].length);

    }

    //helper function for visibility:
    function checkLength(item, length){
        if (length === 0){
            $(item).hide();
        }else{
            $(item).show();
        }
    }

    // reference: http://stackoverflow.com/questions/5285995/how-do-you-sort-letters-in-javascript-with-capital-and-lowercase-letters-combin
    function case_insensitive_comp(strA, strB) {
        return strA.toLowerCase().localeCompare(strB.toLowerCase());
    }

    function checkInContent(contentArray){

        for (i = 0; i < contentArray.length; i++) {
            checkInSingleContent(contentArray[i]);
        }
    }

    //http://a.cms.omniupdate.com/files/checkin
    function checkInSingleContent(contentObject){
        $.ajax({
            dataType: "json",
            url: apihost + "/files/checkin",
            type: "POST",
            data: {
                "authorization_token" : token,
                "site" : contentObject.site,
                "path" : contentObject.path,
            },
            success: function(data){    
                //Do something
            }
            
        });
    }

    function ClearList(){
        $("table#checkedOut tr.site").remove();
        checkedOutContent = [];
    }


    /// If user is admin, change isAdmin to true.
    function checkUserAccess(){
        $.ajax({
            dataType: "json",
            url: apihost + "/users/view",
            type: "GET",
            data: { 
                "authorization_token" : token,
                "account" : gadget.get('account'),
                "user" : gadget.get('user')
            },
            success: function(data){    
                if (data.privilege > 8){
                    isAdmin = true;
                }
            }
            
        });

    }



    // EVENT HANDLERS:

    $(document).on("click", ".check-in", function(){
        var clickedRow = $(this).parent().parent();
        var clickedSite = $(clickedRow).find(".site a").html();

        // reset view:
        checkInContent(checkedOutContent[clickedSite]);
        $(clickedRow).find(".count").html("0 <span class=\"hide-for-sidebar\">files</span>");
        $(clickedRow).find(".btn").addClass("disabled");
        $(clickedRow).addClass("zero-items hidden");
        
    });

    $(document).on("click", ".check-in-directory", function(){
        var clickedRow = $(this).parent().parent();
        
        if (clickedRow.hasClass("everyone-content")){
            checkInContent(checkedOutContent["everyone-content"]);
        }
        
        if (clickedRow.hasClass("user-content")){
            checkInContent(checkedOutContent["user-content"]);
        }
        checkCurrentView();
    });

    $("#refresh").click(function(){
        ClearList();
        getListOfSites();
        checkCurrentView();
    });

    $("#toggle").click(function(){
        $(".zero-items").toggleClass("hidden");
        $("#toggle").toggleClass("btn-success");
    })
    
    $("#checkinALL").click(function(){
        var content;
    	for (content in checkedOutContent){
    	  checkInContent(checkedOutContent[content]);
    	}
        ClearList();
    	getListOfSites();
        checkCurrentView();
    });


    //view_changed:
    $(gadget).on({
        'view_changed' :function(evt, notification){
            if (notification.directory != null){
                getCheckedOutContentInDirectory(gadget.get('site'), notification.directory);
            }
        }
    });

});

$(gadget).on({
    'expanded': function (evt) {
        // This event is triggered when the user expands (makes visible) a sidebar gadget.
        console.log('Gadget expanded.');
    },
    'collapsed': function (evt) {
        // This event is triggered when the user collapses (hides) a sidebar gadget.
        console.log('Gadget collapsed.');
    },
    'configuration': function (evt, config) {
        // If the user changes the gadget's configuration through the configuration modal,
        // the gadget will hear about it and get the new config in the data argument here.
        console.log('New config:', config);
    },
    'notification': function (evt, notification) {
        // If the gadget's config.xml contains a "notification" entry, any notifications
        // of the specified type(s) generated by OU Campus will trigger 'notification'
        // events that can be handled here.
        console.log('Notification received:', notification);
    }
});