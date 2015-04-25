
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

$("#title").blur(function() {
    message = { event: 'title', data: { text: $("#title").val() } };
    send(message);
    save('title', message.data.text);
});

/*
 ***** SubTitle *****
 */

$("#subtitle1").blur(function() {
    message = { event: 'subtitle', data: { text: $("#subtitle1").val() + "<br>" + $("#subtitle2").val() } };
    send(message);
    save('subtitle1', message.data.text);
});

$("#subtitle2").blur(function() {
    message = { event: 'subtitle', data: { text: $("#subtitle1").val() + "<br>" + $("#subtitle2").val() } };
    send(message);
    save('subtitle2', message.data.text);
});

$("#subtitleText").click(function() {
    message = { event: 'subtitle', data: { text: $("#subtitle1").val() + "<br>" + $("#subtitle2").val() } };
    $("[data-group='subtitle-pills']").removeClass("active");
    $(this).addClass("active");
    $("#subtitle1").parent().parent().addClass("has-success");
    $("#subtitle2").parent().parent().addClass("has-success");
    send(message);
});
$("#subtitleAFKBreak").click(function() {
    message = { event: 'subtitle', data: { text: "AFK" + "<br>" + "On Break" } };
    $("[data-group='subtitle-pills']").removeClass("active");
    $(this).addClass("active");
    $("#subtitle1").parent().parent().removeClass("has-success");
    $("#subtitle2").parent().parent().removeClass("has-success");
    send(message);
});
$("#subtitleAFKCustom").click(function() {
    message = { event: 'subtitle', data: { text: "AFK"+ "<br>" + $("#subtitle2").val() } };
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
 ***** Crawl *****
 */

$("#crawl-text").blur(function() {
    message = { event: 'value', data: { id: "crawl-text", text: $("#crawl-text").val() } };
    send(message);
    save('crawl-text', message.data.text);
});

$("#crawlDisable").click(function() {
    message = { event: 'value', data: { id: "crawl-text", action: "hidden" } };
    $("[data-group='crawl-pills']").removeClass("active");
    $(this).addClass("active");
    $("#label-crawl").removeClass(classes_label).addClass("label-default");
    send(message);
});

$("#crawlBlack").click(function() {
    message = { event: 'value', data: { id: "crawl-text", action: "marquee-black" } };
    $("[data-group='crawl-pills']").removeClass("active");
    $(this).addClass("active");
    $("#label-crawl").removeClass(classes_label).addClass("label-primary");
    send(message);
});

$("#crawlBlue").click(function() {
    message = { event: 'value', data: { id: "crawl-text", action: "marquee-blue" } };
    $("[data-group='crawl-pills']").removeClass("active");
    $(this).addClass("active");
    $("#label-crawl").removeClass(classes_label).addClass("label-info");
    send(message);
});

$("#crawlRed").click(function() {
    message = { event: 'value', data: { id: "crawl-text", action: "marquee-red" } };
    $("[data-group='crawl-pills']").removeClass("active");
    $(this).addClass("active");
    $("#label-crawl").removeClass(classes_label).addClass("label-danger");
    send(message);
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

// Catch ESC anywhere to blur the element, which should process the input
$(document).keyup(function(e) {
    if (e.keyCode == 27) { $(document.activeElement).blur(); }   // escape key maps to keycode `27`
});

// When we are ready, set page up for the user
$(document).ready( function() {
    // TODO Fix Subtitle loading
    reload();
});
