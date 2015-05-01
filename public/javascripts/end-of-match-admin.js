socket.on('connect', function() {
    console.log("connected.");
    socket.emit('join', 'end-of-match');
});

var save = function(key, value) { return; };
var read = function(key) { return; };

//TODO - Process config push from server

var classes_label = "label-primary label-default label-info label-success label-danger label-warning";


function send(message) {
    socket.emit('broadcast', message);
    console.log(message);    
}

if(typeof(Storage) !== "undefined") {
    console.log("has storage");
    save = function(key, value) {
        var json = JSON.parse(localStorage.getItem("json"));
        json[key] = value;
        localStorage.setItem("json", JSON.stringify(json));
        console.log(key + " saved: " + value);
    };
    read = function(key) {
        var json = JSON.parse(localStorage.getItem("json"));
        if (json === null || json[key] === undefined) {
            return undefined;
        }
        console.log(json[key]);
        return json[key];
    };
    reload = function() {
        var json = JSON.parse(localStorage.getItem("json"));
        if (json === null) {
            return undefined;
        }
        $.each( json, function (id, value) {
            $("#" + id).val(value);
        });
    }
} else {
    console.log("does not has storage");
}

$("#reloadButton").click(function() {
    send({ event: 'reload' });
});
$("#hideMsgButton").click(function() {
    message = { event: 'hide-messages' };
    send(message);
    $("#showMsgButton").show();
    $("#hideMsgButton").hide();
});
$("#showMsgButton").click(function() {
    message = { event: 'show-messages' };
    send(message);
    $("#hideMsgButton").show();
    $("#showMsgButton").hide();
});

/*
 ***** SubTitle *****
 */

$("#subtitle1").blur(function() {
    message = { event: 'value', data: { id: "mainview_header_subtitle", text: $("#subtitle1").val() + "<br>" + $("#subtitle2").val() } };
    send(message);
    save('subtitle1', $("#subtitle1").val());
});

$("#subtitle2").blur(function() {
    message = { event: 'value', data: { id: "mainview_header_subtitle", text: $("#subtitle1").val() + "<br>" + $("#subtitle2").val() } };
    send(message);
    save('subtitle2', $("#subtitle2").val());
});

$("#subtitleText").click(function() {
    message = { event: 'value', data: { id: "mainview_header_subtitle", text: $("#subtitle1").val() + "<br>" + $("#subtitle2").val() } };
    $("[data-group='subtitle-pills']").removeClass("active");
    $(this).addClass("active");
    $("#subtitle1").parent().parent().addClass("has-success");
    $("#subtitle2").parent().parent().addClass("has-success");
    send(message);
});
$("#subtitleAFKBreak").click(function() {
    message = { event: 'value', data: { id: "mainview_header_subtitle", text: "AFK" + "<br>" + "On Break" } };
    $("[data-group='subtitle-pills']").removeClass("active");
    $(this).addClass("active");
    $("#subtitle1").parent().parent().removeClass("has-success");
    $("#subtitle2").parent().parent().removeClass("has-success");
    send(message);
});
$("#subtitleAFKCustom").click(function() {
    message = { event: 'value', data: { id: "mainview_header_subtitle", text: "AFK"+ "<br>" + $("#subtitle2").val() } };
    $("[data-group='subtitle-pills']").removeClass("active");
    $(this).addClass("active");
    $("#subtitle1").parent().parent().removeClass("has-success");
    $("#subtitle2").parent().parent().addClass("has-success");
    send(message);
});

$("#hero").change(function() {
    message = { event: 'hero', data: { text: $("#hero").val() } };
    send(message);
    save('hero', message.data.text);
});

$("#rank").blur(function() {
    message = { event: 'rank', data: { text: $("#rank").val() } };
    send(message);
    save('rank', message.data.text);
});


/*
 ***** Voice *****
 */

$("#voiceHide").click(function() {
    message = { event: 'action', data: { id: 'voice_container', action: 'ignore', value: 'true' } };
    send(message);
    $("#voiceShow").show();
    $("#voiceHide").hide();
});
$("#voiceShow").click(function() {
    message = { event: 'action', data: { id: 'voice_container', action: 'ignore', value: 'false' } };
    send(message);
    $("#voiceHide").show();
    $("#voiceShow").hide();
});


/*
 ***** Crawl *****
 */

$("#crawl-text").blur(function() {
    message = { event: 'value', data: { id: "crawl-text", text: $("#crawl-text").val() } };
    send(message);
    save('crawl-text', message.data.text);
});

$("#crawlDisable").click(function() {
    $("[data-group='crawl-pills']").removeClass("active");
    $(this).addClass("active");
    $("#label-crawl").removeClass(classes_label).addClass("label-default");
    send({ event: 'action', data: { id: "mainview_footer", action: "visible", value: "hide" }});
});

$("#crawlBlack").click(function() {
    $("[data-group='crawl-pills']").removeClass("active");
    $(this).addClass("active");
    $("#label-crawl").removeClass(classes_label).addClass("label-primary");
    send({ event: 'action', data: { id: "mainview_footer_marquee", action: "class", value: "marquee-black" }});
    send({ event: 'action', data: { id: "mainview_footer", action: "visible", value: "show" }});
});

$("#crawlBlue").click(function() {
    $("[data-group='crawl-pills']").removeClass("active");
    $(this).addClass("active");
    $("#label-crawl").removeClass(classes_label).addClass("label-info");
    send({ event: 'action', data: { id: "mainview_footer_marquee", action: "class", value: "marquee-blue" }});
    send({ event: 'action', data: { id: "mainview_footer", action: "visible", value: "show" }});
});

$("#crawlRed").click(function() {
    $("[data-group='crawl-pills']").removeClass("active");
    $(this).addClass("active");
    $("#label-crawl").removeClass(classes_label).addClass("label-danger");
    send({ event: 'action', data: { id: "mainview_footer_marquee", action: "class", value: "marquee-red" }});
    send({ event: 'action', data: { id: "mainview_footer", action: "visible", value: "show" }});
});

/*
 ****** Selects and Inputs *****
 */

$("select").change(function() {
    message = { event: 'value', data: { id: $(this).attr("id"), text: $("#" + $(this).attr("id") + " option:selected").text() } };
    send(message);
    save(message.data.id, message.data.text);
});

// Increment or decrement value fields with up/down arrows
$("input[data-group='value']").keydown( function( event ) {
    if ( event.which == 13 ) {
        event.preventDefault();
    }
    switch( event.keyCode ) {
        case 38: //up
            $(this).val(parseInt($(this).val())+1);
            break;
        case 40: //down
            $(this).val(parseInt($(this).val())-1);
            break;
    }
});

// Process input of value field
//   perform maths if needed
//   send if good input
$("input[data-group='value']").blur(function() {
    result = $(this).val();
    if (result.indexOf("/") > 0) {
        console.log(result);
        pattern = new RegExp(/[0-9]\//);
        if (pattern.test(result)) {
            result = parseInt(eval(result)*100);
            console.log(result);
        } else {
            return 0;
        }
    }
    if ($.isNumeric(parseInt(result))) {
        $(this).val(parseInt(result));
        message = { event: 'value', data: { id: $(this).attr("id"), text: $(this).val() } };
        send(message);
        save(message.data.id, message.data.text);
    }
});


$("input[data-group='text']").blur(function() {
    result = $(this).val();
    pattern = new RegExp(/[a-zA-Z0-9 ]/);
    if (pattern.test(result) || result == "") {
        message = { event: 'value', data: { id: $(this).attr("id"), text: $(this).val() } };
        send(message);
        save(message.data.id, message.data.text);
    }
});

// Catch ESC anywhere to blur the element, which should process the input
$(document).keyup(function(e) {
    if (e.keyCode == 27) { $(document.activeElement).blur(); }   // escape key maps to keycode `27`
});

// When we are ready, set page up for the user
$(document).ready( function() {
    // TODO Fix Subtitle loading
    reload();
});
