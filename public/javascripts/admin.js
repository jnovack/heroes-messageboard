
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
        console.log(json[key]);
        return json[key];
    };
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

$("#subtitle").blur(function() {
    message = { event: 'subtitle', data: { text: $("#subtitle").val() } };
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

var reload = function(id) {
    $("#" + id).val(read(id));
    save(id, read(id));
}

$(document).ready( function() {
    reload("title");
    reload("subtitle");
    reload("hero");
    reload("rank");
    reload("crawl");

    reload("blackhearts-bay-percent");
    reload("cursed-hollow-percent");
    reload("dragon-shire-percent");
    reload("haunted-mines-percent");
    reload("garden-of-terror-percent");
    reload("sky-temple-percent");
    reload("tomb-of-the-spider-queen-percent");


});