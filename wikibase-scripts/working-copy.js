/* Any JavaScript here will be loaded for all users on every page load. */
//final draftttt


var _propertyId = "";
var _propertyLabel = ""

var _wikibasesync_base_url = "http://127.0.0.1:5000/";

(function (mw, $) {

    try{
    var __inputWithSuggestion = $('#new .ui-entityselector-input').val();

    if (!__inputWithSuggestion) {
        $(".mez-appended-button").remove();
        console.log('clone button removed');
    }

    var __focusInput = document.getElementsByClassName("ui-suggester-input ui-entityselector-input")[0].value;
    if (!__focusInput) {
        $(".mez-appended-button").remove();
        console.log('clone button removed');
    }
    }catch(err){}
}(mediaWiki, jQuery));


(function (mw, $) {
    var _parentEl = document.getElementsByClassName('wikibase-entityview wb-item')
    console.log(_parentEl)

    const observer = new MutationObserver(function (mutations_list) {
        mutations_list.forEach(function (mutation) {
            mutation.addedNodes.forEach(function (added_node) {
                //console.log(Object.keys(added_node));
                var entries = Object.entries(added_node);
                var focusInput;

                if (entries.length == 2) {
                    if (entries[0][1]) {
                        if (entries[0][1].uiOoMenuItem && entries[0][1].uiOoMenuItem._label == "No match was found") {
                            console.log('No found');
                            var notFoundEl = document.getElementsByClassName('ui-ooMenu-item ui-ooMenu-customItem ui-entityselector-notfound')[0];
                            console.log(notFoundEl);


                            //if (entries.length == 3) {
                            //console.log(added_node);
                            focusInput = document.getElementsByClassName("ui-suggester-input ui-entityselector-input")[0].value;
                            console.log(focusInput);

                            //always remove clone button while typing
                            $("#new .ui-entityselector-input").on("keydown", "", function (e) {
                                console.log("key down");
                                $(".mez-appended-button").remove();
                            });
                            //}
                            if (focusInput) {
                                console.log('here');
                                $('#new .ui-entityselector-input').autocomplete({ //This is the class Name of your desired input source: 
                                    source: function (request, response) {
                                        console.log('Request term: ' + request.term);
                                        $.ajax({
                                            // url: 'https://www.wikidata.org/w/api.php?action=wbsearchentities&search=' + request.term + '&format=json&errorformat=plaintext&language=en-gb&uselang=en-gb&type=property',
                                            url: _wikibasesync_base_url + 'remote-wikidata-query/' + request.term,
                                            // data: {term: request.term},
                                            // dataType: "json",
                                            crossDomain: true,
                                            headers: {
                                                // "accept": "application/json",
                                                "Access-Control-Allow-Origin": "*",
                                                "Access-Control-Request-Headers3": "x-requested-with"
                                            },
                                            success: function (data) {
                                                console.log(data);

                                                response($.map(data.response.search, function (item) {
                                                    _propertyId = item.id;
                                                    _propertyLabel = item.label;
                                                    return {
                                                        label: item.description,
                                                        value: item.label,
                                                        id: item.id
                                                    }
                                                }));
                                            }
                                        });
                                    }
                                });

                                //insert clone button
                                var inputWithSuggestionParent = $('#new .ui-entityselector-input').parent();

                                if (inputWithSuggestionParent) {
                                    console.log('new value: ' + _propertyId);
                                    $(".mez-appended-button").remove();
                                    inputWithSuggestionParent.append("<button class='mez-appended-button' style='display:block' onclick='cloneAction()'>Clone</button>");
                                }
                            }
                            if (!focusInput) {
                                //remove clone button
                                var inputWithSuggestionParent = $('#new .ui-entityselector-input').parent();

                                if (inputWithSuggestionParent) {
                                    $(".mez-appended-button").remove();
                                }
                            }

                        }
                    }
                }


            });
        });
    });

    observer.observe(document.querySelector("body"), { subtree: true, childList: true });
}(mediaWiki, jQuery));

//ui-menu-item. 
//clone button clicked
function cloneAction() {
    //clone action called
    console.log(_propertyId);

    //api call
    var wikibaseSyncUrl = _wikibasesync_base_url + 'import-wikidata-item/' + _propertyId;
    $.ajax({
        // data: {term: request.term},
        // dataType: "json",
        url: wikibaseSyncUrl,
        crossDomain: true,
        headers: {
            // "accept": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Request-Headers3": "x-requested-with"
        },
        success: function (data) {
            console.log(data);
            //remove clone button
            var inputWithSuggestionParent = $('#new .ui-entityselector-input').parent();

            if (inputWithSuggestionParent) {
                $(".mez-appended-button").remove();
                console.log('clone button removed');
            }
            // response($.map(data.response.search, function (item) {
            //     _propertyId = item.id;
            //     _propertyLabel = item.label;
            //     return {
            //         label: item.description,
            //         value: item.label,
            //         id: item.id
            //     }
            // }));
        }
    });
}