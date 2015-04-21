$(document).ready(function(){

// Initialize content 
initContent();
function initContent(){
    $('html, body').css('cursor','none');
    setTimeout(rotateTabs, 12500);
};

// Evaluate Messages //
var messageTimer;
var timer;
var c = 0;
paginateMessages();

function fadeMessage(){
    $('#mainview_body ul li').each(function(){
        if(Math.floor($(this).position().top > $(window).height()-$(this).height()-$("#mainview_footer").height()-8)){
            $(this).fadeTo(0,0);
        }else if(Math.floor($(this).position().top < $(window).height()-$(this).height()-$("#mainview_footer").height()-8)){
            $(this).fadeTo(500,1);
        }
    });
};

function paginateMessages(){
    fadeMessage();
    
    clearTimeout(timer);

    //var listAmount = $('#mainview_body ul li').size() * 3;
    var listAmount = $('#mainview_body ul li').size();
    var listHeight = Math.ceil($('#mainview_body ul').height());    
    var itemHeight = $('#mainview_body ul li:nth-child(1)').height();
    var height = itemHeight + 43;

    console.log(c);

    if(c == 0){
        timer = setTimeout(paginateMessages, 10000);
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
                $('#mainview_body ul li:nth-child(1)').clone().appendTo('#mainview_body ul');
                $('#mainview_body ul li:nth-child(1)').remove();
                $('#mainview_body ul').css('margin-top', 0);
                timer = setTimeout(paginateMessages, 10000);
                fadeMessage();
            }
         });    
    }else if(c > listAmount){
        clearTimeout(timer);
        timer = setTimeout(paginateMessages, 10000);
        console.log('refreshed');
        c = 0;
    }
    c++;    
}

function rotateTabs() {
    allTabs = $("[data-group|='sidebar_body_containers']");
    current = $("[data-group|='sidebar_body_containers'].bounceInLeft");
    if (allTabs.last()[0] == current[0]) {
        next = allTabs.first();
    } else {
        next = current.next();
    }
    $("[data-group|='sidebar_body_containers']").removeClass("bounceOutLeft bounceInLeft").addClass("animated bounceOutLeft");
    next.removeClass().addClass("animated bounceInLeft");
    setTimeout(rotateTabs, 12500);
}

/*
$('.marquee').marquee({
    //speed in milliseconds of the marquee
    duration: 15000,
    //gap in pixels between the tickers
    gap: 200,
    //time in milliseconds before the marquee will start animating
    delayBeforeStart: 0,
    //'left' or 'right'
    direction: 'left',
    //true or false - should the marquee be duplicated to show an effect of continues flow
    duplicated: true
});
*/

});
