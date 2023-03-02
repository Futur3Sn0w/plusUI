// import VanillaTilt from 'vanilla-tilt';

var wallFilter = localStorage.getItem('unsplashTags');
var backdropImg = 'https://source.unsplash.com/featured/?sig=' + Math.random() + '&' + wallFilter;
const cards = document.querySelectorAll('.parallax');

function isTouchScreendevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints;
};

window.onload = function () {
    showTime();
    showDate();

    if (isTouchScreendevice()) {
        $('.card').removeClass('parallax');
        $('.context-tooltip').attr('data-touch', 'Tap ');
    } else {
        $('.context-tooltip').attr('data-touch', 'Click ');
        $('.parallax').tilt({
            perspective: 350,   // Transform perspective, the lower the more extreme the tilt gets.
            scale: 1.075,      // 2 = 200%, 1.5 = 150%, etc..
            speed: 500    // Speed of the enter/exit transition
        });
    }

    if (localStorage.getItem('debug') == true) {
        $('.dbg').addClass('enabled');
        $('#cbDebugCards').prop('checked', true);
    }
    $('.topChrome').scrollTop(800)

    applyKeys();

    setTheme();
    setDbg();
    alignShelf();
    if ($('.cards').hasClass('collapsed') == 0) {
        $('.saoC').addClass('override-hidden');
    } else {
        $('.saoC').removeClass('override-hidden');
    }

    $(".subCards").sortable({
        appendTo: $('.subCards'),
        axis: "x",
        revert: true
    });

    $('.subCards').sortable('disable');

    localStorage.setItem('float', 'false');
    $('#textCardTB').val(localStorage.getItem('textCard'));

    $('#backDrop2').css('background-image', "url(" + backdropImg + ")");
    $('body').css('background-image', "url(" + backdropImg + ")");
    refreshWall();
    setInterval("refreshWall();", 90000);

    setTimeout("cardSmarts();", 500);

    $('#topChromeAboutBtn').text($('.siteVer').text());

    doTheBatteryThing();
    chargingIndic();
}

// Tilt

$('#cbDisablePara').on('click', function () {
    if ($('.parallax').hasClass('parallax-disabled') == 0) {
        const tilt = $('.parallax').tilt();
        tilt.tilt.destroy.call(tilt);
        localStorage.setItem('parallax', 'false');
        $('.parallax').addClass('parallax-disabled');
    } else {
        localStorage.setItem('parallax', 'true');
        $('.parallax').removeClass('parallax-disabled');

        $('.parallax').tilt({
            perspective: 350,   // Transform perspective, the lower the more extreme the tilt gets.
            scale: 1.075,      // 2 = 200%, 1.5 = 150%, etc..
            speed: 500    // Speed of the enter/exit transition
        });
    }
})

// 

window.addEventListener('load', function () {
    this.localStorage.setItem('cardsWidth', $('.cards').css('width'));
})

var lsOwmAPI = "984b3d6c3b801e60a2eaf094da08b866";
var lsOwmCity = "4791259";

function applyKeys() {
    weatherBalloon(lsOwmCity);
    window.setInterval("weatherBalloon(lsOwmCity);", 10000);
}

$('.lightDark').on('click', function () {
    if (localStorage.getItem('theme') == 'light') {
        localStorage.setItem('theme', 'dark');
        setTheme();
    } else {
        localStorage.setItem('theme', 'light');
        setTheme();
    }
});

$('.reloadPage').on('click', function () {
    window.location.reload();
});

$('.topChrome').on('scroll', function () {
    if ($('.topChrome').scrollTop() == 0) {
        $('.expandToggle').addClass('expanded')
    } else if ($('.topChrome').scrollTop() > 2) {
        $('.expandToggle').removeClass('expanded');
    }
});

$('.expandToggle').on('click', function () {
    if ($('.topChrome').scrollTop() == 0) {
        $('.topChrome').scrollTop(800)
        $('.expandToggle').removeClass('expanded')
    } else {
        $('.topChrome').scrollTop(0)
        $('.expandToggle').addClass('expanded');
    }
});

$('.wallCard').on('click', function (e) {
    if ($('.shelf').hasClass('float')) {

    } else {
        $('.cards').toggleClass('collapsed');

        if ($('.cards').hasClass('collapsed')) {
            $('.context-tooltip').attr('data-state', 'to expand shelf');
        } else {
            $('.context-tooltip').attr('data-state', 'to collapse shelf');
        }
        if ($('.cards').hasClass('collapsed') == 0) {
            $('.saoC').addClass('override-hidden');
            $('#saoL-radio').click();
        } else {
            $('.saoC').removeClass('override-hidden');
        }
    }
});

$('.scApp').on('click', function () {
    window.open('https://' + $(this).attr('data-launch') + '.com');
});

$('#unsplashTags').focusout(function () {
    localStorage.setItem('unsplashTags', $(this).val());
    $('.wallCard').attr('data-wallSet', $(this).val());
    refreshWall();
});

$(document).mouseup(function (e) {
    var element = $(".controlPanel");
    var element2 = $(".controlPanel *");
    var element3 = $(".card");
    var element4 = $(".card *");
    var element5 = $(".context-selected-card");
    var element6 = $(".context-selected-card *");

    if (!element.is(e.target) && !element2.is(e.target)) {
        $('.topChrome').scrollTop(800)
        $('.expandToggle').removeClass('expanded')
    }

    if (!element3.is(e.target) && !element4.is(e.target)) {
        $('.editMode').removeClass('editMode');
        $('.subCards').sortable('disable');
    }

    if (!element3.is(e.target) && !element4.is(e.target)) {
        $('.contextMenuDiv').removeClass('show');
    }

    if (!$(".context-selected-card").is(e.target) && !$(".context-selected-card *").is(e.target) && !$(".contextMenuDiv").is(e.target) && !$(".contextMenuDiv *").is(e.target)) {
        $('.context-selected-card').removeClass('context-selected-card')
    }
});

$('#cbDebugCards').click(function () {
    if (localStorage.getItem('debug') == 'true') {
        $('.dbg').removeClass('enabled');
        localStorage.setItem('debug', 'false');
    } else {
        $('.dbg').addClass('enabled');
        localStorage.setItem('debug', 'true');
    }
});

$('.card').on('contextmenu', function (e) {
    e.preventDefault();
    if (isTouchScreendevice()) {
        $('.cards').addClass('editMode');
        $('.subCards').sortable('enable');
        $('.context-selected-card').removeClass('context-selected-card')
    } else {
        cardContextMenu(this);
    }
});

$('.cmi-resize').on('click', function () {
    if ($('.context-selected-card').hasClass('rectCard')) {
        $('.context-selected-card').addClass('squareCard').removeClass('rectCard');
    } else if ($('.context-selected-card').hasClass('squareCard')) {
        $('.context-selected-card').addClass('rectCard').removeClass('squareCard');
    }
    $('.context-selected-card').removeClass('context-selected-card')
});

$('.cmi-editMode').click(function (e) {
    $('.cards').addClass('editMode');
    $('.subCards').sortable('enable');
    $('.context-selected-card').removeClass('context-selected-card')
});

$('.cmi-disableCard').on('click', function () {
    $('.context-selected-card').addClass('disabled').removeClass('context-selected-card');
})

// $('.card').click(function (e) {
//     if ($('.cards').hasClass('editMode')) {
//         $(this).toggleClass('disabled');
//     }
// });

$('.labeled').mouseover(function (e) {
    $('.shelfLabel').text($(this).attr('data-friendlyName'));
});

$('.labeled').mouseout(function (e) {
    $('.shelfLabel').text('Shelf');
});

$('.wallCard').on('hover', function () {
    $('.shelfLabel').text('Click or tap to close');
})

$('.sao-radio').click(function (e) {
    localStorage.setItem('shelfPos', e.target.id);
    alignShelf();
});

$('#openWallpaperBtn').click(function (e) {
    var bg = $('body').css('background-image');
    bg = bg.replace('url(', '').replace(')', '').replace(/\"/gi, "");
    window.open(bg);
    e.stopPropagation();
});

function alignShelf() {
    if (localStorage.getItem('shelfPos') == "saoL-radio") {
        $('.shelf').removeClass('right');
        $('.shelf').removeClass('center');
        $('.shelf').addClass('left');
        $('#saoR-radio').attr('checked', false)
        $('#saoC-radio').attr('checked', false)
        $('#saoL-radio').attr('checked', true)
    } else if (localStorage.getItem('shelfPos') == "saoC-radio") {
        $('.shelf').removeClass('right');
        $('.shelf').addClass('center');
        $('.shelf').removeClass('left');
        $('#saoR-radio').attr('checked', false)
        $('#saoC-radio').attr('checked', true)
        $('#saoL-radio').attr('checked', false)
    } else if (localStorage.getItem('shelfPos') == "saoR-radio") {
        $('.shelf').addClass('right');
        $('.shelf').removeClass('center');
        $('.shelf').removeClass('left');
        $('#saoR-radio').attr('checked', true)
        $('#saoC-radio').attr('checked', false)
        $('#saoL-radio').attr('checked', false)
    }
}

setInterval(() => {
    d = new Date(); //object of date()
    hr = d.getHours();
    min = d.getMinutes();
    sec = d.getSeconds();
    hr_rotation = 30 * hr + min / 2; //converting current time
    min_rotation = 6 * min;
    sec_rotation = 6 * sec;

    hour.style.transform = `rotate(${hr_rotation}deg)`;
    minute.style.transform = `rotate(${min_rotation}deg)`;
    second.style.transform = `rotate(${sec_rotation}deg)`;
}, 1000);

var battery = navigator.battery || navigator.webkitBattery || navigator.mozBattery || navigator.msBattery;

function doTheBatteryThing() {
    navigator.getBattery().then(function (battery) {
        var bLevPerc = (battery.level * 100) + "%";
        var bLev = battery.level * 100;
        var batteryIsCharging = battery.charging;
        battery.addEventListener('levelchange', function () {
            $('.bciProg').css('width', bLevPerc);
            $('.batteryText').text(Math.round(bLev) + "%");
            $('.batteryText').attr('data-battLvl', Math.round(bLev));
        });
        $('.bciProg').css('width', bLevPerc);
        $('.batteryText').text(Math.round(bLev) + "%");
        $('.batteryText').attr('data-battLvl', Math.round(bLev));
    });
}

function chargingIndic() {
    let batteryIsCharging = false;

    navigator.getBattery().then(function (battery) {
        batteryIsCharging = battery.charging;
        batteryIsCharging ? $('.chargingIcon').css('color', "#3daa39") : $('.chargingIcon').css('color', "transparent");

        battery.addEventListener('chargingchange', function () {
            batteryIsCharging = battery.charging;
            batteryIsCharging ? $('.chargingIcon').css('color', "#3daa39") : $('.chargingIcon').css('color', "transparent");
        });
    });
}

function cardSmarts() {
    // the below will hide the battery card if the host device doesn't have a battery
    $('.batteryText').width() == "0" ? $('.batteryCard').hide() : $('.batteryCard').show();

    // this will slim the card to a square when device is charged. this can be removed if desired.
    var lev = $('.batteryText').attr('data-battLvl');

    if (lev >= "97" || lev == "100") {
        $('.batteryText').remove();
        $('.batteryCard').addClass('squareCard');
        $('.bcIndicator').css('background-color', "white");
    } else {
        doTheBatteryThing();
    }
}

// Switch theme function

function setTheme() {
    if (localStorage.getItem('theme') === 'dark') {
        $('.button').addClass('darkModeOn');

        $('.surface').addClass('darkModeOn');

        $('.clockCard').addClass('darkModeOn');
        $('.calendarCard').addClass('darkModeOn');
        $('.shortcutCard').addClass('darkModeOn');
        $('.wallCard').addClass('darkModeOn');
        $('.modal-about').addClass('darkModeOn');
        $('.controlPanel').addClass('darkModeOn');
    } else {
        $('.darkModeOn').removeClass('darkModeOn');
    }
}

// Enable debug (experimental) cards function

function setDbg() {
    if (localStorage.getItem('debug') == 'true') {
        $('.dbg').addClass('enabled');
        $('#cbDebugCards').attr('checked', true)
    } else {
        $('.dbg').removeClass('enabled');
        $('#cbDebugCards').attr('checked', false)
    }
}

// Refresh wallpaper button

$('#refreshWallBtn').on('click', function (e) {
    refreshWall();
    e.stopPropagation();
});

function refreshWall() {
    var wallFilter = localStorage.getItem('unsplashTags');
    fetch("https://source.unsplash.com/random/?sig=" + Math.round(Math.random) + '&' + wallFilter).then(data => {
        var backdropSample = data.url;

        $('body').css('background-image', $('#backDrop2').css('background-image'));
        $('.nv2').css('background-image', $('#backDrop2').css('background-image'));
        $('.wallCard').css('background-image', $('#backDrop2').css('background-image'));
        $('#backDrop2').delay(500).css('background-image', "url(" + backdropSample + ")");
    });
    $('.wallCard').attr('data-wallSet', wallFilter);
    $('#unsplashTags').val(wallFilter);
}

// timeCard time and date

function showTime() {
    var date = new Date();
    var h = date.getHours(); // 0 - 23
    var m = date.getMinutes(); // 0 - 59

    if (h == 0) {
        h = 12;
    }

    if (h > 12) {
        h = h - 12;
    }

    m = (m < 10) ? "0" + m : m;

    var time = h + ":" + m;
    document.getElementById("time").innerText = time;

    setTimeout(showTime, 1000);
}

function showDate() {
    const localDate = new Date();
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];

    const currentDay = days[localDate.getDay()];
    const currentDate = localDate.getDate();
    const currentMonth = months[localDate.getMonth()];
    const currentYear = localDate.getFullYear();
    document.getElementById('date').innerText = currentDay + ", " + currentMonth + " " + currentDate;

    $('.calendarCard .month').text(currentMonth);
    $('.calendarCard .calenDayNo').text(currentDate);
    $('.calendarCard .calenDay').text(currentDay);
}

// weatherCard

function weatherBalloon(cityID) {
    fetch('https://api.openweathermap.org/data/2.5/weather?id=' + cityID + '&appid=' + lsOwmAPI)
        .then(function (resp) { return resp.json() }) // Convert data to json
        .then(function (data) {

            setTimeout(drawWeather(data), 10000);

        })
}

function drawWeather(d) {
    var fahrenheit = Math.round(((parseFloat(d.main.temp) - 273.15) * 1.8) + 32);
    document.getElementById('temp').innerText = fahrenheit + '°';
    var wIcon = d.weather[0].icon;
    $('#weatherIcon').attr('src', "http://openweathermap.org/img/wn/" + wIcon + "@4x.png");
}

// Card context menu function

function cardContextMenu(e) {
    if ($(e).hasClass('squareCard')) {
        var cardSize = 'Expand'
        $('#cmi-resize-icn').addClass('fa-up-right-and-down-left-from-center').removeClass('fa-down-left-and-up-right-to-center');
    } else if ($(e).hasClass('rectCard')) {
        var cardSize = 'Shrink'
        $('#cmi-resize-icn').addClass('fa-down-left-and-up-right-to-center').removeClass('fa-up-right-and-down-left-from-center');
    } else {
        var cardSize = 'else'
    }

    $('.context-selected-card').removeClass('context-selected-card');

    if ($(e).parent().parent().hasClass('editMode')) {
    } else {
        if (cardSize == 'else' || $(e).hasClass('noresize')) {
            $('.cmi-resize').addClass('override-hidden');
        } else {
            $('.cmi-resize').removeClass('override-hidden');
        }
        $(e).addClass('context-selected-card');
        var cmLeft = $(".context-selected-card").offset().left - $(document).scrollLeft() + 4;
        var cmLeftS = $(".context-selected-card").offset().left - $(document).scrollLeft() - 35;
        if ($('.context-selected-card').hasClass('rectCard')) {
            $('.contextMenuDiv').css('left', cmLeft);
        } else {
            $('.contextMenuDiv').css('left', cmLeftS);
        }
        $('.cmi-resize').attr('data-btnLabel', cardSize + ' ' + $('.context-selected-card').attr('data-friendlyName'));
        $('.cmi-disableCard').attr('data-btnLabel', $('.context-selected-card').attr('data-friendlyName'));
        $('.contextMenuDiv').addClass('show');
    }
}

// Wallpaper card / shelf alignment gestures (mobile only)

let touchstartX = 0
let touchendX = 0

function checkDirectionWC() {
    if ($('.shelf').hasClass('float')) {
    } else {
        if (touchendX < touchstartX) {
            // left swipe
            if ($('.shelf').hasClass('right')) {
                if ($('.cards').hasClass('collapsed') == 0) {
                    $('#saoL-radio').click()
                } else {
                    $('#saoC-radio').click()
                }
            } else if ($('.shelf').hasClass('center')) {
                $('#saoL-radio').click()
            }
        } else if (touchendX > touchstartX) {
            // right swipe
            if ($('.shelf').hasClass('left')) {
                if ($('.cards').hasClass('collapsed') == 0) {
                    $('#saoR-radio').click()
                } else {
                    $('#saoC-radio').click()
                }
            } else if ($('.shelf').hasClass('center')) {
                $('#saoR-radio').click()
            }
        }
    }

}

document.querySelector('.wallCard').addEventListener('touchstart', e => {
    touchstartX = e.changedTouches[0].screenX
})

document.querySelector('.wallCard').addEventListener('touchend', e => {
    touchendX = e.changedTouches[0].screenX
    checkDirectionWC()
})

// Card context menu swipeup gesture (Touch only)

let touchstartY = 0
let touchendY = 0

$('.card').on('touchstart', function (e) {
    touchstartY = e.changedTouches[0].screenY
    $(this).removeClass('fnDown');
})

$('.card').on('touchend', function (e) {
    touchendY = e.changedTouches[0].screenY
    $(this).addClass('fnDown');
    if (touchendY < touchstartY) {
        // up swipe
        cardContextMenu(this)
        $('.fnCard').removeClass('fnCard');
    }
})

// Control panel gesture pill (mobile only)

function checkDirectionCC() {
    if (touchendX < touchstartX) {
        // left swipe
        if ($('.controlPanel').hasClass('expanded')) {
        } else {
            $('.expandToggle').click()
        }
    } else if (touchendX > touchstartX) {
        // right swipe
        if ($('.controlPanel').hasClass('expanded')) {
        } else {
            $('.expandToggle').click()
        }
    }
}

// Card scroll-up action (Mouse/trackpad only)
scrollup = 0;

$('.card').on('mousewheel', function () {
    if (isTouchScreendevice() == 0) {
        if (scrollup == 5) {
            scrollup = 0
        } else {
            scrollup++;
            cardContextMenu(this)
        }
    }
});

// About modal functions

$('#aboutModalClose').click(function (e) {
    $('.modal-about').removeClass('visible')
});

$('.aboutBtn').click(function (e) {
    $('.modal-about').addClass('visible')
});

$(document).mouseup(function (e) {
    var element = $(".modal-about");

    if (!element.is(e.target)) {
        $('#aboutModalClose').click();
    }
});

// Auto update shelf width

// $(document).click(function () {
//     $('.cards').css('max-width', localStorage.getItem('cardsWidth'));
// })

// Float mode

$('#cbFloatMode').click(function () {
    if (localStorage.getItem('float') == 'true') {
        $('.shelf').removeClass('float');
        localStorage.setItem('float', 'false');
        $('.shelfOpts').removeClass('collapse');
    } else {
        $('.shelf').addClass('float');
        localStorage.setItem('float', 'true');
        $('#saoL-radio').click();

        $('.shelfOpts').addClass('collapse');

        $('.cards').removeClass('collapsed');
    }
});

// Text/notes card

$('#textCardTB').on('keypress', function () {
    localStorage.setItem('textCard', $('#textCardTB').val());
})

// Rolodex Actions

$('.emojiLocaleCard').on('click', function () {
    $('.rolodex').addClass('visible');
})

$('.rolodexCloseBtn').on('click', function () {
    $('.rolodex').removeClass('visible');
})