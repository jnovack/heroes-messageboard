socket.on('connect', function() {
    console.log("socket/messageboard - connected");
    socket.emit('join', 'messageboard');
});

var redgreen = "color-green color-greener color-greenest color-red color-redder color-reddest";


socket.on('command', function(data) {
    console.log(data);

    if (data.command == 'hide-messages') {
        $("#mainview_body").fadeOut();
    }

    if (data.command == 'show-messages') {
        $("#mainview_body").fadeIn();
    }

    if (data.command == 'reload') {
        location.reload();
    }
});

socket.on('action', function(data) {
    console.log(data);

    if (data.action == 'ignore') {
        $("#"+data.id).attr('data-ignore', data.value);
    }
    if (data.action == 'visible') {
        $("#"+data.id).attr('data-visible', data.value);
        if (data.value == 'hide') {
            $("#"+data.id).hide();
        }
        if (data.value == 'show') {
            $("#"+data.id).show();
        }
    }
    if (data.action == 'class') {
        var classNames = $("#"+data.id).attr("class").toString().split(' ');
        $.each(classNames, function (i, className) {
            if (className.indexOf('-') > 0 && data.value.indexOf('-') > 0) {
                if (className.substring(0, className.indexOf('-')) == data.value.substring(0, data.value.indexOf('-'))) {
                    $("#"+data.id).removeClass(className);
                }
            }
        });
        $("#"+data.id).addClass(data.value);
    }
    // Fire off any additional specialized components
    $("#"+data.id).trigger('changeData');
});


socket.on('value', function(data) {
    console.log(data);

    if ($("#"+data.id).text() != data.text) {
        $("#"+data.id).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
            $(this).removeClass("animated bounceIn fadeIn");
        });

        classes = $("#"+data.id).attr('data-classes');

        if ($("#"+data.id).hasClass("background")) {
            $("#"+data.id).css('background-image', "url('../img/"+data.text+".png')");
        }

        if ($("#"+data.id).hasClass("value")) {
            $("#"+data.id).text(data.text).addClass("animated bounceIn");
        }

        if ($("#"+data.id).hasClass("text")) {
            $("#"+data.id).text(data.text).addClass("animated fadeIn");
        }

        if ($("#"+data.id).hasClass("html")) {
            // Format for HTML from Markdown
            data.text = detokenizer(markdown.toHTML(data.text).replace(/<\/?p>/, ''));
            $("#"+data.id).html(replaceLinks(data.text)).addClass("animated fadeIn");
        }

        if ($("#"+data.id).hasClass("divimage")) {
            $("#"+data.id).removeClass().addClass("animated bounceIn divimage divimage-"+data.text+" "+classes);
        }

        if ($("#"+data.id).hasClass("linked-picture")) {
            $("#"+data.id).text(properName(data.text)).addClass("animated bounceIn");
            $("#"+data.id.substring(0, data.id.indexOf('-'))+"-picture").removeClass().addClass("animated bounceIn divimage divimage-"+data.text);
            $("#"+data.id.substring(0, data.id.indexOf('-'))+"-picture").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                $(this).removeClass("animated bounceIn");
            });
        }

        if ($("#"+data.id).hasClass("progress-bar")) {
            $("#"+data.id).css("width", data.text + "%");
        }

        if ($("#"+data.id).hasClass("video")) {
            $("#"+data.id).attr('src', "assets/hero-videos/"+data.text+".webm").removeClass().addClass("video " + data.text);
        }

        if ($("#"+data.id).hasClass("percent")) {
            if  (data.text  < 40) { $("#"+data.id).removeClass(redgreen).addClass("color-reddest"); }
            if ((data.text >= 40) && (data.text < 45)) { $("#"+data.id).removeClass(redgreen).addClass("color-redder"); }
            if ((data.text >= 45) && (data.text < 50)) { $("#"+data.id).removeClass(redgreen).addClass("color-red"); }
            if ((data.text >= 50) && (data.text < 55)) { $("#"+data.id).removeClass(redgreen).addClass("color-green"); }
            if ((data.text >= 55) && (data.text < 60)) { $("#"+data.id).removeClass(redgreen).addClass("color-greener"); }
            if  (data.text >= 60) { $("#"+data.id).removeClass(redgreen).addClass("color-greenest"); }

            $("#"+data.id).text(data.text).addClass("animated bounceIn");
        }

        if ($("#"+data.id).hasClass("ratio")) {
            $("#"+data.id).text(data.text).addClass("animated bounceIn");
            var group = $("#"+data.id).attr('data-group');
            var total = 0;
            $.each( $("[data-group='"+group+"']"), function(val, obj) {
                if ($.isNumeric(parseInt($(obj).text()))) {
                    total = Math.max(parseInt($(obj).text()),total);
                    // total += parseInt($(obj).text());
                }
            });
            $.each( $("[data-group='"+group+"']"), function(val, obj) {
                if ($.isNumeric(total)) {
                    id = $(this).attr('id').substring(0,$(this).attr('id').indexOf("-"));
                    var percent = parseInt($(obj).text())*100/total;
                    $("#"+id+"-progress").css("width", percent + "%");
                }
            });

        }

    }
});
