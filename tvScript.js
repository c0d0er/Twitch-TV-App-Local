var state = {
    streamers: ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "medrybw", "noobs2ninjas", "food", "brunofin", "comster404"],
    data: []
}

function filterStreamers(str) {
    return state.data.filter(streamer => streamer.name.toLowerCase().includes(str.toLowerCase()))
}

/**
 * @param: streamer Object { stream, channel, status, name }
 */

function updateView(streamer) {
    var $twitchDiv = $("#twitchDiv");
    var hNodesOff = "";
    var hNodesOn = "";
    var offLogo = "https://cdn.tutsplus.com/ae/authors/adam-everett-miller/Aetuts_Preview_TV_Turn_Off.jpg";
    var fcc = "https://cdn.tutsplus.com/ae/authors/adam-everett-miller/Aetuts_Preview_TV_Turn_Off.jpg";

    if (streamer.status === 'online') {
        //var logo=data.stream.channel.logo;
        var preview = streamer.stream.preview.medium;
        var description = streamer.stream.channel.status;
        var onName = streamer.name;

        if (description.length > 32) {
            description = description.slice(0, 33);
            description += "..."
        }

        hNodesOn = "<div class='onarea'><a href='https://www.twitch.tv/" +
            streamer.name + "' target='_blank'><img src='" + preview + "' id='onlogo'><span class='twitchTitle'>" + onName +
            "</span></a><span class='line' id='onp'>online</span><p id='pstatus'>" + description + "</p></div>";
        $twitchDiv.prepend(hNodesOn);
    } else {
        hNodesOff = "<div class='offarea'><a href='https://www.twitch.tv/" +
            streamer.name + "' target='_blank'><img src='" + streamer.channel.logo + "' id='offlogo'><span class='twitchTitle'>" + streamer.name + "</span><span class='line' id='poff'>offline</span></div>";
        $twitchDiv.append(hNodesOff);
    }
}

function loadTwitch() {
    var tUrl = "https://api.twitch.tv/kraken/streams/";
    var cId = "?client_id=7l3od9sx1rsri9b30l2p9ddxibl0bk0";

    $.map(state.streamers, function(val, ind) {
        $.getJSON(tUrl + val + cId, function(data) {
            var streamer = {}
            if (data.stream) {
                streamer = {
                    stream: data.stream,
                    channel: data.stream.channel,
                    status: 'online',
                    name: data.stream.channel.display_name
                }
                state.data.push(streamer)
                updateView(streamer)
            } else {
                $.getJSON("https://api.twitch.tv/kraken/channels/" + val + cId, function(data) {
                    streamer = {
                        stream: null,
                        channel: data,
                        status: 'offline',
                        name: data.display_name
                    }
                    state.data.push(streamer)
                    updateView(streamer)
                })
            }
        }).fail(function() {
            var $twitchDiv = $("#twitchDiv");
            var closedLogo = "https://www.rulistings.com/Content/PlaceholderIcons/tv_placeholder.png"
            var hNodesClosed = "";
            hNodesClosed = "<div class='closedarea'><a href='https://www.twitch.tv/" +
                val + "' target='_blank'><img src='" + closedLogo + "' id='closedlogo'><span class='twitchTitle'>" + val +
                "</span><span class='line' id='pclosed'>channel closed</span></div>";
            $twitchDiv.append(hNodesClosed);
        })
    })

    $(".offarea").after(".closedarea");
    $("#all").click(function() {
        $(".onarea").show();
        $(".offarea").show();
        $(".closedarea").show();
    })
    $("#on").click(function() {
        $(".offarea").hide();
        $(".onarea").show();
        $(".closedarea").hide();
    })
    $("#off").click(function() {
        $(".onarea").hide();
        $(".offarea").show();
        $(".closedarea").show();
    })
}

loadTwitch();

$("#twitchSearch").on("input", function() {
    var streamers = filterStreamers($(this).val())
    $("#twitchDiv").empty()
    streamers.forEach(streamer => {
        updateView(streamer)
    })
})

$('input[type=search]').on('search', function(e) {
    if ($(this).val() === "") {
        $("#twitchDiv").empty()
        state.data.forEach(streamer => {
            updateView(streamer)
        })
    }
})

// search is handled by the other events - this just needs to stop the form from reloading the page
$("#form-container").on("submit", function(e) {
    e.preventDefault();
})
