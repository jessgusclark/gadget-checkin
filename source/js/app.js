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

       
        // do stuff...
        getListOfSites();

    });


    // http://a.cms.omniupdate.com/sites/list
    function getListOfSites(){

        $.ajax({
            dataType: "json",
            url: apihost + "/sites/list",
            data: {"authorization_token" : token },
            success: getListOfSitesSuccess
        });

    }

    function getListOfSitesSuccess(recievedData){
        var keys = [];
        // Loop through recievedData and add to array:
        for (i = 0; i < recievedData.length; i++) {
            checkedOutContent[recievedData[i].site] = [];
            getCheckedOutContentInSite(recievedData[i].site);

            keys.push(recievedData[i].site);
        }

        addSitesToTable(keys);
    }

    // http://a.cms.omniupdate.com/files/checkedout?site=www
    function getCheckedOutContentInSite(getSite){

        $.ajax({
            dataType: "json",
            url: apihost + "/files/checkedout?site=" + getSite,
            data: {"authorization_token" : token },
            success: function(recievedData){
                //getCheckedOutContentInSiteSuccess(recievedData, getSite)
                checkedOutContent[getSite] = recievedData;
                $(".site." + getSite.toLowerCase() + " .count" ).html(recievedData.length + " files");
            }            
        });
    }

    function addSitesToTable(keys){
        keys = keys.sort( case_insensitive_comp );

        for (i = 0; i < keys.length; i++) {

            $("table#checkedOut").append("<tr class=\"site " + keys[i].toLowerCase() + "\"><td class=\"site\">" + keys[i] + 
                "</td><td class=\"count\"><td><a class=\"btn btn-default btn-sm check-in pull-right\">Check In</a></td></tr>" );
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


    // EVENT HANDLERS:

    $(document).on("click", ".check-in", function(){
        var clickedRow = $(this).parent().parent();
        var clickedSite = $(clickedRow).find(".site").html();

        // reset view:
        checkInContent(checkedOutContent[clickedSite]);
        $(clickedRow).find(".count").html("0 files");
        $(clickedRow).find(".btn").addClass("disabled");
        
    });

    $("#refresh").click(function(){
        console.log("refreshing");
        $("table#checkedOut tbody").html(" ");
        checkedOutContent = [];
        getListOfSites()
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
        $('#main').css({ 'font-size': config.font_size });
    },
    'notification': function (evt, notification) {
        // If the gadget's config.xml contains a "notification" entry, any notifications
        // of the specified type(s) generated by OU Campus will trigger 'notification'
        // events that can be handled here.
        console.log('Notification received:', notification);
    }
});