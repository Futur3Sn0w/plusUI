// import VanillaTilt from 'vanilla-tilt';

var wallFilter = localStorage.getItem('unsplashTags');
var backdropImg = 'https://source.unsplash.com/featured/?sig=' + Math.random() + '&' + wallFilter;
const cards = document.querySelectorAll('.parallax');

function isTouchScreendevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints;
};

var repeater;

window.onload = function () {
    showTime();
    showDate();

    $('.greeting').removeClass('hidden');
    setTimeout(() => {
        $('.greeting').addClass('hidden');
    }, 10000);

    if (isTouchScreendevice()) {
        $('.card').removeClass('parallax');
    } else {
        $('.card[data-parallaxCard="y"]').tilt({
            perspective: 350,   // Transform perspective, the lower the more extreme the tilt gets.
            scale: 1.075,      // 2 = 200%, 1.5 = 150%, etc..
            speed: 500    // Speed of the enter/exit transition
        });
    }

    $('.rolodex').draggable({
        containment: "parent",
        handle: ".header"
    })

    // applyKeys();
    weatherBalloon(lsOwmCity);

    setTheme();
    if (localStorage.getItem('theme') == null) {
        localStorage.setItem('theme', 'light')
    }
    $('.lightDark').attr('data-theme', localStorage.getItem('theme'));

    alignShelf();
    userNameSet();

    $(".subCards").sortable({
        appendTo: $('.subCards'),
        axis: "x",
        revert: true
    });

    $('.subCards').sortable('disable');
    $('#textCardTB').val(localStorage.getItem('textCard'));

    if (localStorage.getItem('float') == 'true') {
        $('.shelf').addClass('float');
        $('#cbFloatMode').prop('checked', true);
    }

    $('#backDrop2').css('background-image', "url(" + backdropImg + ")");
    $('body').css('background-image', "url(" + backdropImg + ")");
    refreshWall();
    repeater = setInterval(refreshWall, 60000);

    cardSmarts();

    $('.card').each(function (i, e) {
        var curCard = $(e).attr('id');

        $(e).attr('data-enabled', localStorage.getItem(curCard));

        if (localStorage.getItem(curCard + '-size') == 'rectCard') {
            $(e).removeClass('squareCard').addClass('rectCard')
        } else if (localStorage.getItem(curCard + '-size') == 'squareCard') {
            $(e).removeClass('rectCard').addClass('squareCard')
        }

        $('.card[data-enabled=y]').removeClass('deckCard').detach().appendTo($('.subCards'));
        $('.card[data-enabled=n]').addClass('deckCard').detach().appendTo($('.cbs1'));
    })

    recallCards();
    dockRadi();

    $('#topChromeAboutBtn').text($('.siteVer').text());

    // doTheBatteryThing();
    // chargingIndic();

    setTimeout(() => {
        $('.loader').addClass('loaded');
    }, 1000);
}

$('.reloadPage').on('click', function () {
    window.location.reload();
});

$(document).mouseup(function (e) {
    saveCards();

    $('.card').each(function (e) {
        // localStorage.setItem($(e).attr('id') + '-index', $(e).attr('data-index'))
    })

    if (!$(".controlPanel").is(e.target) && !$(".controlPanel *").is(e.target) && !$(".timeDate").is(e.target) && !$(".timeDate *").is(e.target)) {
        // $('.topChrome').scrollTop(800)
        $('.ccb.ccb1').click()
        $('.controlPanel').removeClass('expanded')
        $('.timeDate').removeClass('ccOpen')
    }

    if (!$(".card").is(e.target) && !$(".card *").is(e.target)) {
        $('.editMode').removeClass('editMode');
        $('.subCards').sortable('disable');
        $('.contextMenuDiv').removeClass('show');
    }

    if (!$(".context-selected-card").is(e.target) && !$(".context-selected-card *").is(e.target) && !$(".contextMenuDiv").is(e.target) && !$(".contextMenuDiv *").is(e.target)) {
        $('.cmSep').children().appendTo($('.context-selected-card').children('.cardOptions'));
        $('.context-selected-card').removeClass('context-selected-card')
    }

    if (!$(".modal-about").is(e.target) && !$(".modal-about *").is(e.target)) {
        $('#aboutModalClose').click();
    }

    if (!$(".rolodex").is(e.target) && !$(".rolodex *").is(e.target)) {
        $('.rolodexCloseBtn').click();
    }

    dockRadi();
});

function refreshWall() {
    $('<div class="prevWall interactable-hov" onclick="clearWall(this)">').prependTo('.wallList').css('background-image', $('#backDrop2').css('background-image'));

    var wallFilter = localStorage.getItem('unsplashTags');
    fetch("https://source.unsplash.com/random/?sig=" + Math.round(Math.random) + '&' + wallFilter).then(data => {
        var backdropSample = data.url;

        localStorage.setItem('backdropURL', $('#backDrop2').css('background-image').replace('url("', '').replace('")', ''));
        $('body').css('background-image', $('#backDrop2').css('background-image'));
        $('#backDrop2').delay(500).css('background-image', "url(" + backdropSample + ")");
    });
    $('#unsplashTags').val(wallFilter);
}

$('#openWallpaperBtn').click(function (e) {
    window.open(localStorage.getItem('backdropURL'));
    e.stopPropagation();
});

$('#refreshWallBtn').on('click', function (e) {
    refreshWall();
    repeater = setInterval(refreshWall, 60000);
    e.stopPropagation();
});

function clearWall(e) {
    // alert($(e).attr('class'));
    $('body').css('background-image', $(e).css('background-image'));
    clearInterval(repeater)
}

// Rolodex Actions

$('.rolodexOpen').on('click', function (e) {
    i = 0
    $('.rolodex').addClass('visible');
    $('.cbs1').scrollLeft(0);

    if ($('.cbs1').children().length == 0) {
        // $('.cbs1').children().first().addClass('hoveredCard')
        $('.cbs1').attr('data-sectName', 'Your card deck is empty')
        $('.cbs1').attr('data-cardDesc', 'Move a card to the deck from the shelf.')
        $('.rolodex').addClass('empty')
    } else {
        $('.cbs1').children().first().addClass('hoveredCard')
        $('.cbs1').attr('data-sectName', $('.hoveredCard').attr('data-friendlyName'))
        $('.cbs1').attr('data-cardDesc', $('.hoveredCard').attr('data-cardDesc'))
        $('.rolodex').removeClass('empty')
    }

    e.stopPropagation();
})

$('.rolodexCloseBtn').on('click', function () {
    $('.rolodex').removeClass('visible');
})

let i = 0
// var scroller = $('.cbs1').children();

$('.mvCtrl.left').on('click', function () {
    i = i - 1
    if (i == -1) {
        i = 0
        $('.cbs1').scrollLeft(0)
    } else {
        $('.cbs1').scrollLeft($('.cbs1').scrollLeft() - 100);
    }
    // alert(i)
    $('.hoveredCard').removeClass('hoveredCard')
    $('.cbs1').children().eq(i).addClass('hoveredCard')
    $('.cbs1').attr('data-sectName', $('.hoveredCard').attr('data-friendlyName'))
    $('.cbs1').attr('data-cardDesc', $('.hoveredCard').attr('data-cardDesc'))
})

$('.mvCtrl.right').on('click', function () {
    i = i + 1
    if (i == $('.cbs1').children().length) {
        i = 0
        $('.cbs1').scrollLeft(0)
    } else {
        $('.cbs1').scrollLeft($('.cbs1').scrollLeft() + 100);
    }
    // alert(i)
    $('.hoveredCard').removeClass('hoveredCard')
    $('.cbs1').children().eq(i).addClass('hoveredCard')
    $('.cbs1').attr('data-sectName', $('.hoveredCard').attr('data-friendlyName'))
    $('.cbs1').attr('data-cardDesc', $('.hoveredCard').attr('data-cardDesc'))
})

$('.addBtn').on('click', function (e) {
    $('.hoveredCard').attr('data-enabled', 'y');
    $('.hoveredCard').removeClass('deckCard').addClass('removing').appendTo($('.subCards'));
    setTimeout(() => {
        $('.hoveredCard').removeClass('removing').removeClass('.hoveredCard');
    }, 500);
    $(".subCards").sortable("enable");
    $(".subCards").sortable("refresh");
    $(".subCards").sortable("disable");
    $(".card").each(function (i, e) {
        var enabled = $(e).attr('data-enabled');
        var card = $(e).attr('id');

        localStorage.setItem(card, enabled);
        // $(this).attr('data-index', $(this).index());
    });
    dockRadi();
    saveCards();

    if ($('.cbs1').children().length == 0) {
        // $('.cbs1').children().first().addClass('hoveredCard')
        $('.cbs1').attr('data-sectName', 'Your card deck is empty')
        $('.cbs1').attr('data-cardDesc', 'Move a card to the deck from the shelf.')
        $('.rolodex').addClass('empty')
    } else {
        $('.cbs1').children().first().addClass('hoveredCard')
        $('.cbs1').scrollLeft(0)
        i = 0;
        $('.cbs1').attr('data-sectName', $('.hoveredCard').attr('data-friendlyName'))
        $('.cbs1').attr('data-cardDesc', $('.hoveredCard').attr('data-cardDesc'))
        $('.rolodex').removeClass('empty')
    }
})

// Expandable card functionality

$(document).on('click', '.expandableWindow .return', function () {
    $(this).parent().addClass('closing');
    setTimeout(() => {

        $(this).parent().children('.card.expanded').addClass('removing').removeClass('expanded')
        $(this).parent().children('.card').prependTo('.subCards');

        setTimeout(() => {
            $('.card.removing').removeClass('removing');
            dockRadi();
            $(".subCards").sortable("refresh");

            $(this).parent().remove();
        }, 200);


    }, 500);
})

$(document).on('mousedown', '.expandableWindow', function () {
    $(this).addClass('md');
})

$(document).on('mouseup', '.expandableWindow', function () {
    $(this).removeClass('md');
})