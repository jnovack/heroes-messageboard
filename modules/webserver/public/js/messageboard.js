$(document).ready(function(){

// Initialize content
initContent();
function initContent(){
    $('html, body').css('cursor','none');
    $("#messages li:odd").addClass("dim");
    resetTimer();
};

// Evaluate Messages //
var messageTimer;
var timer;
var c = 0;
paginateMessages();

function fadeMessage(){
    $('#messages li').each(function(){

        if ( $(this).html() === "" ) {
            $(this).hide();
        } else {
            $(this).show();

            var mvbody = document.getElementById("mainview_body").getBoundingClientRect();
            var mvhead = document.getElementById("mainview_header").getBoundingClientRect();
            var mvbody_height = mvbody.bottom - mvbody.top;
            var mvhead_height = mvhead.bottom - mvhead.top;

            var element = $(this).position().top + $(this).height() + parseInt($(this).css('padding-top')) + parseInt($(this).css('padding-bottom'));
            var footer = mvbody_height + mvhead_height;

            if (Math.floor(element > footer)){
                $(this).fadeTo(0,0);
            } else {
                $(this).fadeTo(500,1);
            }

        }

    });
};

function paginateMessages(){
    fadeMessage();

    clearTimeout(timer);

    var rotateTimer = 10000;
    var listAmount = $('#mainview_body ul li').size();
    var listHeight = Math.ceil($('#mainview_body ul').height());
    var itemHeight = $('#mainview_body ul li:nth-child(1)').height();
    var height = itemHeight + 43;

    if(c == 0){
        timer = setTimeout(paginateMessages, rotateTimer);
    }else if(c <= listAmount){
        $('#mainview_body ul').animate({
            marginTop: -height
          }, {
            duration: 1000,
            specialEasing: {
                marginTop: 'easeInOutBack'
            },
            complete: function() {
                clearTimeout(timer);
                $('#mainview_body ul li:nth-child(1)').clone().appendTo('#mainview_body ul').fadeTo(0,0);
                if ($('#mainview_body ul li:nth-last-child(2)').hasClass('dim')) {
                    $('#mainview_body ul li:last-child').removeClass('dim');
                } else {
                    $('#mainview_body ul li:last-child').addClass('dim');
                }
                $('#mainview_body ul li:nth-child(1)').remove();
                $('#mainview_body ul').css('margin-top', 0);
                timer = setTimeout(paginateMessages, rotateTimer);
                fadeMessage();
            }
         });
    }else if(c > listAmount){
        clearTimeout(timer);
        timer = setTimeout(paginateMessages, rotateTimer);
        //console.log('refreshed');
        c = 0;
    }
    c++;
}

// Hack to restart marquee if it breaks...
$('#mainview_footer').bind('changeData', function(e){
    if ($('#mainview_footer').attr('data-visible') == "show") {
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
