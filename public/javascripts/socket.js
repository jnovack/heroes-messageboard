var socket = io();

socket.on('connect', function() {
    console.log("socket.io - connected");
});

socket.on('joined', function(data){
    console.log("socket.io - joined " + data);
});

socket.on('log', function(data) {
    console.log(data);
});

function properName(hero) {
    if (hero.indexOf('_') > 0) {
        hero = hero.substring(0, hero.indexOf('_'));
    }
    switch (hero) {
        case 'anubarak':
            return "Anub'arak";
            break;
        case 'etc':
            return "ETC";
            break;
        case 'kaelthas':
            return "Kael'thas";
            break;
        case 'lili':
            return "Li Li";
            break;
        case 'sgt-hammer':
            return "Sgt. Hammer";
            break;
        case 'the-lost-vikings':
            return "The Lost Vikings";
            break;
        default:
            return hero.charAt(0).toUpperCase()+hero.substr(1).toLowerCase();
    }
}

// Catch ESC anywhere to blur the element, which should process the input
$(document).keyup(function(e) {
    if (e.keyCode == 27) { $(document.activeElement).blur(); }   // escape key maps to keycode `27`
});