
var save = function(key, value) { return; };
var read = function(key) { return; };

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

$("#subtitle1").blur(function() {
    message = { event: 'subtitle', data: { text: $("#subtitle1").val() + "<br>" + $("#subtitle2").val() } };
    send(message);
    save('subtitle', message.data.text);
});

$("#subtitle2").blur(function() {
    message = { event: 'subtitle', data: { text: $("#subtitle1").val() + "<br>" + $("#subtitle2").val() } };
    send(message);
    save('subtitle', message.data.text);
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

$("#crawl").blur(function() {
    message = { event: 'crawl', data: { text: $("#crawl").val() } };
    send(message);
    save('crawl', message.data.text);
});

$("input[data-group='percents']").change(function() {
    message = { event: 'value', data: { id: $(this).attr("id"), text: parseInt($(this).val()) } };
    send(message);
    save(message.data.id, message.data.text);
});

    }

$(document).ready( function() {
    reload();
});

