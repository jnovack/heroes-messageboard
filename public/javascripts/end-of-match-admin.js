var save = function(key, value) { return; };
var read = function(key) { return; };

//TODO - Process config push from server

var classes_label = "label-primary label-default label-info label-success label-danger label-warning";


function send(message) {
    socket.emit('broadcast', message);
    console.log(message);    
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
});

$("#subtitle2").blur(function() {
    message = { event: 'value', data: { id: "mainview_header_subtitle", text: $("#subtitle1").val() + "<br>" + $("#subtitle2").val() } };
    send(message);
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
    message = { event: 'value', data: { id: $(this).attr("data-for"), text: $("#" + $(this).attr("id") + " option:selected").text() } };
    send(message);
});

$("[data-group='game-control-pills']").click(function() {
    var game = $(this).attr("data-game");
    $("[data-game='"+game+"']").show();
    $(this).hide();
    replaceClass("label-"+$(this).attr("data-class"),"label-"+game);
    var id = game + '-container';
    send({ event: 'action', data: { id: id, action: "visible", value: $(this).attr("data-action") }});
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
$("input[data-group='value']").change(function() {
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
    }
});


$("input[data-group='text']").change(function() {
    result = $(this).val();
    pattern = new RegExp(/[a-zA-Z0-9 ]/);
    if (pattern.test(result)) {
        message = { event: 'value', data: { id: $(this).attr("id"), text: $(this).val() } };
        send(message);
    }
});

// Catch ESC anywhere to blur the element, which should process the input
$(document).keyup(function(e) {
    if (e.keyCode == 27) { $(document.activeElement).blur(); }   // escape key maps to keycode `27`
});

// When we are ready, set page up for the user
$(document).ready( function() {
});
