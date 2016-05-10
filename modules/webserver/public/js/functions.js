var regex_color = new RegExp(
   "(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)"
 );

var regex_url = new RegExp(
  "^" +
    // protocol identifier
    "(?:(?:https?|ftp)://)" +
    // user:pass authentication
    "(?:\\S+(?::\\S*)?@)?" +
    "(?:" +
      // IP address exclusion
      // private & local networks
      "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
      "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
      "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
      // IP address dotted notation octets
      // excludes loopback network 0.0.0.0
      // excludes reserved space >= 224.0.0.0
      // excludes network & broacast addresses
      // (first & last IP address of each class)
      "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
      "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
      "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
    "|" +
      // host name
      "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
      // domain name
      "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
      // TLD identifier
      "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))*" +
    ")" +
    // port number
    "(?::\\d{2,5})?" +
    // resource path
    "(?:/\\S*)?" +
  "$", "i"
);

// Meant for removing multiple bootstrap classes like "text-green text-red text-yellow" before adding a single class
function buildWildcardClass(prefix) {
    return function (index, css) {
        return (css.match (new RegExp("(^|\\s)" + prefix + "-\\S+", "g") ) || []).join(' ');
    }
}

$(document).keyup(function(e) {
    // Catch ESC anywhere to blur the element for triggering any javascripts
    if (e.keyCode == 27) { $(document.activeElement).blur(); }

    // Shift+Enter forces a blur/focus on the field to trigger any javascripts
    if (e.keyCode == 13 && e.shiftKey) { var elem = document.activeElement; $(elem).blur(); $(elem).focus();}
});

function animateCSS(id, animation) {
    if (animation === undefined) {
        animation = $('#'+id).attr('data-animation');
    }

    $('#'+id).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
        $(this).removeClass('animated '+ animation);
    });

    $('#'+id).addClass('animated '+ animation);
}

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

function detokenizer(string) {
    string = string.replace(/\n/g, "<img src='/img/heroes-logo.png'>")
    string = string.replace(/%color-end%/g, "</span>");
    string = string.replace(/%color-(\w+)%/g, "<span class='inline-$1'>");
    string = string.replace(/%(\w+)%/, "<img src='assets/hero-portraits/$1.jpg'>");
    return string;
}

function replaceLinks(string) {
  return string.replace(/\{\{(.*)\}\}/g, '<span class="link">$1</span>');
}