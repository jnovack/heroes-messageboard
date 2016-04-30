$(document).ready(function(){

// Initialize content
initContent();
function initContent(){
    $('html, body').css('cursor','none');
    $("#messages li:odd").addClass("dim");
    resetTimer();
};

/***** BEGIN MessageBoard Animation Javascripts *****/
var rotateTime = 12000;
var loopTimer;
loadMessages();
loopTimer = setTimeout(paginateMessages, 1000); // HACK: wait a second to load from socket.io

function loadMessages(){
    var i = 1;
    var className = ['dim', ''];
    $('#messages li').each(function(){
        // Hide or show element on rotation
        if ( $(this).attr('data-ignore') == "true" ) {
            $(this).addClass('hide');
        } else {
            i = i % 2 + 1;
            $(this).removeClass('hide');
        }

        $(this).addClass(className[i-1]);
    });

    fadeMessages();
}

function fadeMessages(){
    $('#messages li').each(function(){
        if ( $('#'+$(this).attr('id')+'-text').html().length === 0 ) {
            $(this).addClass('hide');
        }

        var mvbody = document.getElementById("mainview_body").getBoundingClientRect();
        var mvhead = document.getElementById("mainview_header").getBoundingClientRect();
        var mvbody_height = mvbody.bottom - mvbody.top;
        var mvhead_height = mvhead.bottom - mvhead.top;

        var element = $(this).position().top + $(this).height() + parseInt($(this).css('padding-top')) + parseInt($(this).css('padding-bottom'));
        var footer = mvbody_height + mvhead_height;

        if (Math.floor(element > footer)){
            // Fade element out if required
            if (($(this).css('opacity') !== "0")) {
                $(this).fadeTo(0,0);
            }
        } else {
            // Fade element in if required
            if (($(this).css('opacity') !== "1") && ($(this).attr('data-ignore') != "true")) {
                $(this).fadeTo(600,1);
            }
        }
    });
};

function rotateMessages() {
    // Rotate the current element to the bottom and remove it from the top.
    $('#messages li:nth-child(1)').clone().appendTo('#messages').fadeTo(0,0);
    $('#messages li:nth-child(1)').remove();

    // Reset margin top after animation
    $('#messages').css('margin-top', 0);

    // Hide or show element on rotation
    if ( $('#messages li:last-child').attr('data-ignore') == "true" ) {
        $('#messages li:last-child').addClass('hide');
    } else {
        $('#messages li:last-child').removeClass('hide');
    }

    // Calculate last non-hidden message
    var i;
    for (i = 2; i < $('#messages li').size(); i++) {
        if ($('#messages li:nth-last-child('+i+')').not('.hide').size() == 1) { break; }
    }

    // Set proper class
    if ($('#messages li:nth-last-child('+i+')').hasClass('dim') == true) {
        $('#messages li:last-child').removeClass('dim');
    } else {
        $('#messages li:last-child').addClass('dim');
    }

    // If the next message is hidden, cycle it anyway.
    if ($('#messages li:nth-child(1)').hasClass('hide')) {
        rotateMessages();
    }
}

function paginateMessages(){

    var listAmount = $('#messages li').size();
    var listHeight = Math.ceil($('#messages').height());
    var itemHeight = $('#messages li:nth-child(1)').height();
    var height = itemHeight + 43; // to cover the easeInOutBack animation

    clearTimeout(loopTimer);

    $('#messages').animate({
        marginTop: -height
      }, {
        duration: 1000,
        specialEasing: {
            marginTop: 'easeInOutBack'
        },
        complete: function() {
            clearTimeout(loopTimer);

            rotateMessages();

            loopTimer = setTimeout(paginateMessages, rotateTime);
            fadeMessages();
        }
    });
}
/***** END MessageBoard Animation Javascripts *****/

// Hack to restart marquee if it breaks...
$('#mainview_footer').bind('changeData', function(e){
    if ($('#mainview_footer').attr('data-visible') == "show") {
        document.getElementById('mainview_footer_marquee').stop();
        document.getElementById('mainview_footer_marquee').start();
    }
});

function resetTimer() {
    $("#timer_percent").one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend' , function(event){
        rotateTabs();
    });
    $("#timer_percent").removeClass("countup").addClass("countdown");

    // By default all elements are hidden, show the first container
    current = $("[data-group|='sidebar_body_containers'].bounceInLeft");
    if (current.length == 0) {
        $("[data-group|='sidebar_body_containers']").not("[data-ignore|='true']").first().removeClass().addClass("animated bounceInLeft");
    }
}

function rotateTabs() {
    $("#timer_percent").one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend' , function(event){
        resetTimer();
    });
    $("#timer_percent").removeClass("countdown").addClass("countup");
    allTabs = $("[data-group|='sidebar_body_containers']").not("[data-ignore|='true']");
    current = $("[data-group|='sidebar_body_containers'].bounceInLeft");
    if (allTabs.last()[0] == current[0] || current.length == 0) {
        next = allTabs.first();
    } else {
        next = current.next();
    }
    $("[data-group|='sidebar_body_containers']").removeClass("bounceOutLeft bounceInLeft").addClass("animated bounceOutLeft");
    next.removeClass().addClass("animated bounceInLeft");
}

});
