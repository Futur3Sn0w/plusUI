// import VanillaTilt from 'vanilla-tilt';

var wallFilter = localStorage.getItem('unsplashTags');
var backdropImg = 'https://source.unsplash.com/featured/?sig=' + Math.random() + '&' + wallFilter;
const cards = document.querySelectorAll('.parallax');

function isTouchScreendevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints;
};

var repeater;

let paraCards = $('.card[data-parallaxCard="y"]');

window.onload = function () {
    showTime();
    showDate();

    setupLSVals();

    if (localStorage.getItem('firstVisit') == '1') {
        $('.firstVisitExperience').remove();
        $('.contextBadge').removeClass('fve');
        $('.shelf').removeClass('fve');
        $('.topChromeItems').removeClass('fve');
    } else {
        $('.firstVisitExperience').addClass('show');
        $('.contextBadge').addClass('fve');
        $('.shelf').addClass('fve');
        $('.topChromeItems').addClass('fve');
        localStorage.setItem('firstVisit', '1');
    }

    setAgent();

    $('.greeting').removeClass('hidden');
    setTimeout(() => {
        $('.greeting').addClass('hidden');
    }, 10000);

    $('.contextBadge').attr('ver', $('.siteVer').text()).addClass('visible');
    setTimeout(() => {
        $('.contextBadge').removeClass('visible');
    }, 5000);

    if (isTouchScreendevice()) {
        $('.card').removeClass('parallax');
        $('#cbParallaxToggle').parent().remove();
        $('.monoModeDCE').detach().appendTo('.themeOpts .group');
        $('.shelf').addClass('touch');
    } else {
        if (localStorage.getItem('parallax') == 'true') {
            paraCards.each(function () {
                VanillaTilt.init(this, {
                    reverse: true,
                    max: 15,
                    scale: 1.075,
                    gyroscope: false,
                    speed: 400
                });
            });
            $('#cbParallaxToggle').prop('checked', true);
        }
    }

    if (localStorage.getItem('liveWall') == 'true') {
        clearInterval(repeater)
        $('#backDrop2').css('background-image', "url(resc/dark.png)");
        $('body').css('background-image', "none");

        liveLinks();

        $('<embed class="siteDrop" src="' + localStorage.getItem('liveLink') + '" type="">').appendTo('body');

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
        $('#siteDropToggle').prop('checked', false);
    }

    setTheme();
    $('.lightDark').attr('data-theme', localStorage.getItem('theme'));

    alignShelf();
    userNameSet();

    $(".subCards").sortable({
        appendTo: $('.subCards'),
        axis: "x",
        revert: true
    });

    $('.subCards').sortable('disable');

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

    var newClass = localStorage.getItem('clockStyle') == '1' ? 'a' : 'b';
    $('.clockCard').addClass('style-' + newClass);
    $('#clockCardStyle' + localStorage.getItem('clockStyle')).prop('checked', true);


    if (localStorage.getItem('card-weatherCard-data') !== null) {
        restoreCardData();
    } else {
        updateCardData();
    }
    // recallCards();
    dockRadi();

    aboutStats();

    setTimeout(() => {
        $('.loader').addClass('loaded');
        $('.shelf').removeClass('notLoaded');
        $('.timeDate').removeClass('notLoaded');
    }, 750);
}

$(document).ready(function () {
    startCards();
})

$('.fveDone').click(function () {
    localStorage.setItem('firstVisit', '1');
    location.reload();
})

// Fires whenever click/tapped

$(document).mouseup(function (e) {
    // saveCards();
    updateCardData();

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
        hideContextMenu();
    }

    dockRadi();
});

function setAgent() {
    var browser = {
        // More granular detection for Chrome & Chromium-based browsers
        isChrome: window.chrome && !window.opera && !window.opr && typeof navigator.webkit !== 'undefined',
        isFirefox: /^((?!chrome|android).)*firefox/i.test(navigator.userAgent),
        isSafari: /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
    };

    if (browser.isChrome) {
        // console.log("Chrome-based");
        localStorage.setItem('reportedBrowserAgent', "Chrome-based");
        $('body').attr('browser', "Chrome");
    } else if (browser.isFirefox) {
        // console.log("Firefox");
        localStorage.setItem('reportedBrowserAgent', "Firefox");
        $('body').attr('browser', "Firefox");
    } else if (browser.isSafari) {
        // console.log("Safari");
        localStorage.setItem('reportedBrowserAgent', "Safari");
        $('body').attr('browser', "Safari");
    } else {
        // console.log("Else/unsupported");
        localStorage.setItem('reportedBrowserAgent', "Else/unsupported");
        $('body').attr('browser', "Else");
    }
}

// Backdrop functions

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
        $('.siteDrop').attr('src', localStorage.getItem('liveLink'))
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

// Set default localStorage values if they don't exist:

function setupLSVals() {
    if (localStorage.getItem('tempUnit') == null) {
        localStorage.setItem('tempUnit', 'c');
    }

    if (localStorage.getItem('theme') == null) {
        localStorage.setItem('theme', 'light')
    }

    if (localStorage.getItem('liveWall') == null) {
        localStorage.setItem('liveWall', 'false')
    }

    if (localStorage.getItem('cardList') == null) {
        localStorage.setItem('cardList', '')
    }

    if (localStorage.getItem('liveLink') == null) {
        localStorage.setItem('liveLink', 'https://flux.sandydoo.me')
    }

    if (localStorage.getItem('shelfPos') == null) {
        localStorage.setItem('shelfPos', 'saoC-radio')
    }

    if (localStorage.getItem('parallax') == null) {
        localStorage.setItem('parallax', 'true')
    }

    if (localStorage.getItem('clockStyle') == null) {
        localStorage.setItem('clockStyle', '1')
    }

    if (localStorage.getItem('float') == null) {
        localStorage.setItem('float', 'true')
    }

    if (localStorage.getItem('allowTextCardDarkMode') == null) {
        localStorage.setItem('allowTextCardDarkMode', 'false')
    }

    if (localStorage.getItem('monoCards') == null) {
        localStorage.setItem('monoCards', 'false')
    }

    if (localStorage.getItem('musicLauncherTarget') == null) {
        localStorage.setItem('musicLauncherTarget', 'AM')
    }

    if (localStorage.getItem('assistantTarget') == null) {
        localStorage.setItem('assistantTarget', 'siri')
    }
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

    updateCardData();

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