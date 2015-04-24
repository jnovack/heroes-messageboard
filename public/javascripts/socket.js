var socket = io();

socket.on('reload', function(data){
    console.log("reloading...");
    location.reload();
});

socket.on('hero', function(data) {
    console.log("hero: " + data.text);
    $("#sidebar_header_video").attr('src', "assets/hero-videos/"+data.text+".webm").removeClass().addClass(data.text);
    //$("#sidebar_header_video").load();
});

socket.on('title', function(data) {
    console.log("title: " + data.text);
    $("#mainview_header_title").html(data.text);
    $("#mainview_header_title").addClass("animated bounceIn");
});

socket.on('subtitle', function(data) {
    console.log("subtitle: " + data.text);
    $("#mainview_header_subtitle").html(data.text);
    $("#mainview_header_subtitle").addClass("animated bounceIn");
});

socket.on('rank', function(data) {
    console.log("rank: " + data.text);
    $("#sidebar_footer_text").html(data.text);
    $("#sidebar_footer_text").addClass("animated bounceIn");

});

socket.on('crawl', function(data) {
    console.log("crawl: " + data.text);
    $("#mainview_footer_marquee").html(data.text);
});

socket.on('hide-messages', function(data) {
    $("#mainview_body").fadeOut();
});

socket.on('show-messages', function(data) {
    $("#mainview_body").fadeIn();
});

var redgreen = "color-green color-greener color-greenest color-red color-redder color-reddest";

socket.on('value', function(data) {
    console.log(data);

    $("#"+data.id).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
      $(this).removeClass("animated bounceIn");
    });

    if ($("#"+data.id).hasClass("percent")) {
        $("#"+data.id).text(data.text);
        if (data.text < 40) { $("#"+data.id).removeClass(redgreen).addClass("color-reddest animated bounceIn"); return; }
        if (data.text < 45) { $("#"+data.id).removeClass(redgreen).addClass("color-redder animated bounceIn"); return; }
        if (data.text < 50) { $("#"+data.id).removeClass(redgreen).addClass("color-red animated bounceIn"); return; }
        if (data.text < 55) { $("#"+data.id).removeClass(redgreen).addClass("color-green animated bounceIn"); return; }
        if (data.text < 60) { $("#"+data.id).removeClass(redgreen).addClass("color-greener animated bounceIn"); return; }
        $("#"+data.id).removeClass(redgreen).addClass("color-greenest animated bounceIn");
    }

        if ($("#"+data.id).hasClass("ratio")) {
            var group = $("#"+data.id).attr('data-group');
            var total = 0;
            $.each( $("[data-group='"+group+"']"), function(id, value) {
                total += parseInt($(value).text());
            });
            var percent = data.text*100/total;
            console.log(data.text + " / " + total + " = " + data.text/total);
            if  (percent  < 10) { $("#"+data.id).removeClass(redgreen).addClass("color-reddest"); }
            if ((percent >= 10) && (percent < 17)) { $("#"+data.id).removeClass(redgreen).addClass("color-redder"); }
            if ((percent >= 17) && (percent < 25)) { $("#"+data.id).removeClass(redgreen).addClass("color-red"); }
            if ((percent >= 25) && (percent < 33)) { $("#"+data.id).removeClass(redgreen).addClass("color-green"); }
            if ((percent >= 33) && (percent < 40)) { $("#"+data.id).removeClass(redgreen).addClass("color-greener"); }
            if  (percent >= 40) { $("#"+data.id).removeClass(redgreen).addClass("color-greenest"); }

            $("#"+data.id).text(data.text).addClass("animated bounceIn");
        }
});