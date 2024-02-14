// import VanillaTilt from 'vanilla-tilt';

var wallFilter = localStorage.getItem('unsplashTags');
var backdropImg = 'https://source.unsplash.com/featured/?sig=' + Math.random() + '&' + wallFilter;
const cards = document.querySelectorAll('.parallax');

function isTouchScreendevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints;
};

var repeater;
let tilt;

window.onload = function () {
    showTime();
    showDate();

    $('.greeting').removeClass('hidden');
    setTimeout(() => {
        $('.greeting').addClass('hidden');
    }, 10000);

    $('.aboutBtn').attr('ver', 'PlusUI ' + $('.siteVer').text()).addClass('visible');
    setTimeout(() => {
        $('.aboutBtn').removeClass('visible');
    }, 5000);

    // if (isTouchScreendevice()) {
    //     $('.card').removeClass('parallax');
    // } else {
    //     tilt = $('.subCards .card[data-parallaxCard="y"]').tilt({
    //         perspective: 350,   // Transform perspective, the lower the more extreme the tilt gets.
    //         scale: 1.075,      // 2 = 200%, 1.5 = 150%, etc..
    //         speed: 500    // Speed of the enter/exit transition
    //     });
    // }

    if (localStorage.getItem('liveWall') == 'true') {
        clearInterval(repeater)
        $('#backDrop2').css('background-image', "url(resc/dark.png)");
        $('body').css('background-image', "none");

        if (localStorage.getItem('liveLink') == null) {
            localStorage.setItem('liveLink', 'https://flux.sandydoo.me')
        }
        $('<embed src="' + localStorage.getItem('liveLink') + '" type="">').appendTo('.siteDrop');

        $('.liveLinkPreset').each(function () {
            var url = $(this).attr('url');
            // alert(url + ", " + localStorage.getItem('liveLink'))
            if (url == localStorage.getItem('liveLink')) {
                $(this).children('input').prop('checked', true);
            }
        });

        $('#liveLinkTB').val(localStorage.getItem('liveLink'));
        $('#siteDropToggle').prop('checked', true);
    } else {
        $('#backDrop2').css('background-image', "url(" + backdropImg + ")");
        $('body').css('background-image', "url(" + backdropImg + ")");
        repeater = setInterval(refreshWall, 60000);
    }

    if (tempUnit == null) {
        localStorage.setItem('tempUnit', 'c');
    } else if (tempUnit == 'f') {
        localStorage.setItem('tempUnit', 'f');
    } else if (tempUnit == 'c') {
        localStorage.setItem('tempUnit', 'c');
    }
    weather();

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

    if (localStorage.getItem('monoCards') == 'true') {
        $('.subCards').addClass('plated');
        $('#cbMonoMode').prop('checked', true);
    }

    if (localStorage.getItem('allowTextCardDarkMode') == 'true') {
        $('.textCard').addClass('allowDark');
        $('#allowTextCardDarkMode').prop('checked', true);
    }

    // cardSmarts();

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

    outputStars();

    // doTheBatteryThing();
    // chargingIndic();

    setTimeout(() => {
        $('.loader').addClass('loaded');
        $('.shelf').removeClass('notLoaded');
        $('.timeDate').removeClass('notLoaded');
    }, 1000);
}

$(document).mouseup(function (e) {
    saveCards();

    $('.card').each(function (e) {
        // localStorage.setItem($(e).attr('id') + '-index', $(e).attr('data-index'))
    })

    if (!$(".controlPanel").is(e.target) && !$(".controlPanel *").is(e.target) && !$(".timeDate").is(e.target) && !$(".timeDate *").is(e.target)) {
        // $('.topChrome').scrollTop(800)
        $('.ccb.ccb1').click()
        $('.controlPanelOptGroup').removeClass('visible');
        $('.controlPanel').removeClass('expanded')
        $('.timeDate').removeClass('ccOpen')
    }

    if (!$(".card").is(e.target) && !$(".card *").is(e.target)) {
        $('.editMode').removeClass('editMode');
        $('.subCards').sortable('disable');
        $('.subCards').removeClass('freeze');
    }

    if (!$(".context-selected-card").is(e.target) && !$(".context-selected-card *").is(e.target) && !$(".contextMenuDiv").is(e.target) && !$(".contextMenuDiv *").is(e.target)) {
        $('.context-selected-card').addClass('temp').removeClass('context-selected-card');
        setTimeout(() => {
            $('.cmSep').children().appendTo('.card.temp .cardOptions');
        }, 300);
        $('.subCards').removeClass('freeze');
        $('.contextMenuDiv').removeClass('show');
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
    if (localStorage.getItem('liveWall') == 'true') {
        window.open(localStorage.getItem('liveLink'));
    } else {
        window.open(localStorage.getItem('backdropURL'));
    }
    e.stopPropagation();
});

$('#refreshWallBtn').on('click', function (e) {
    if (localStorage.getItem('liveWall') == 'true') {
        $('.siteDrop').children('embed').attr('src', localStorage.getItem('liveLink'))
    } else {
        clearInterval(repeater)
        refreshWall();
        repeater = setInterval(refreshWall, 60000);
    }
    e.stopPropagation();
});

function clearWall(e) {
    // alert($(e).attr('class'));
    $('body').css('background-image', $(e).css('background-image'));
    clearInterval(repeater)
}

// Expandable card functionality

$(document).on('click', '.expandableWindow .return', function () {
    $(this).parent().parent().addClass('closing');
    setTimeout(() => {

        var thiscard = $(this).parent().parent().attr('returncard')
        $('.card.placeholderCard[returncard="' + thiscard + '"]').addClass('removing');

        $(this).parent().parent().children('.card.expanded').addClass('removing').removeClass('expanded')

        setTimeout(() => {
            $('.placeholderCard[returncard="' + thiscard + '"]').after($(this).parent().parent().children('.card'));
            $('.card.placeholderCard[returncard="' + thiscard + '"]').remove();
            $('.card.removing').removeClass('removing');
            dockRadi();
            $(".subCards").sortable("refresh");

            $(this).parent().parent().remove();
        }, 200);


    }, 300);

    $('.shelfLabel').addClass('show').text("Expandable closed");
    setTimeout(() => {
        $('.shelfLabel').removeClass('show')
    }, 5000);
})

$(document).on('mousedown', '.expandableWindow', function () {
    $(this).addClass('md');
})

$(document).on('mouseup', '.expandableWindow', function () {
    $(this).removeClass('md');
})