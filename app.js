var wallFilter = localStorage.getItem('unsplashTags');
var backdropImg = 'https://source.unsplash.com/featured/?sig=' + Math.random() + wallFilter;

window.onload = function () {
    showTime();
    showDate();

    function isTouchScreendevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints;
    };

    if (isTouchScreendevice()) {
        $('.card').removeClass('parallax');
    } else {
        const cards = document.querySelectorAll('.parallax');
        VanillaTilt.init(cards, {
            reverse: true,  // reverse the tilt direction
            max: 25,     // max tilt rotation (degrees)
            perspective: 400,   // Transform perspective, the lower the more extreme the tilt gets.
            scale: 1.05,      // 2 = 200%, 1.5 = 150%, etc..
            speed: 700,    // Speed of the enter/exit transition
            transition: true,   // Set a transition on enter/exit.
            reset: true,   // If the tilt effect has to be reset on exit.
            easing: "cubic-bezier(.03,.98,.52,.99)",    // Easing on enter/exit.
            glare: false,  // if it should have a "glare" effect
            "max-glare": 1,      // the maximum "glare" opacity (1 = 100%, 0.5 = 50%)
            "glare-prerender": false,
            gyroscope: false
        });
    }

    if (localStorage.getItem('debug') == true) {
        $('.dbg').addClass('enabled');
        $('#cbDebugCards').prop('checked', true);
    }

    applyKeys();

    setTheme();
    setDbg();
    alignShelf();

    $('#backDrop2').css('background-image', "url(" + backdropImg + ")");
    $('body').css('background-image', "url(" + backdropImg + ")");
    refreshWall();
    setInterval("refreshWall();", 30000);

    setTimeout("cardSmarts();", 500);

    doTheBatteryThing();
    chargingIndic();
}

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

$('.expandToggle').on('click', function () {
    $('.controlBtns').toggleClass('visible');
    $('.expandToggle').toggleClass('expanded');
});

$('.shelfCollapseToggle').on('click', function () {
    $('.cards').toggleClass('collapsed');
    $('.shelfCollapseToggle').toggleClass('expanded');
});

$('.scApp').on('click', function () {
    window.open('https://' + $(this).attr('data-launch') + '.com');
});

$('#unsplashTags').focusout(function () {
    localStorage.setItem('unsplashTags', '&' + $(this).val());
    refreshWall();
});

$(document).mouseup(function (e) {
    var element = $(".controlBtns");
    var element2 = $(".controlBtns *");

    if (!element.is(e.target) && !element2.is(e.target)) {
        $('.controlBtns').removeClass('visible');
        $('.expandToggle').removeClass('expanded');
    }
});

$(document).mouseup(function (e) {
    var element = $(".card");
    var element2 = $(".card *");

    if (!element.is(e.target) && !element2.is(e.target)) {
        $('.editMode').removeClass('editMode');
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
    $('.cards').addClass('editMode');
});

$('.card').click(function (e) {
    if ($(this).parent().hasClass('editMode')) {
        $(this).toggleClass('disabled');
    }
});

$('.labeled').mouseover(function (e) {
    $('.shelfLabel').text($(this).attr('data-friendlyName'));
});

$('.labeled').mouseout(function (e) {
    $('.shelfLabel').text('Shelf');
});

$('.sao-radio').click(function (e) {
    localStorage.setItem('shelfPos', e.target.id);
    alignShelf();
});

function alignShelf() {
    if (localStorage.getItem('shelfPos') == "saoL-radio") {
        $('.shelf').removeClass('right');
        $('.shelf').removeClass('center');
        $('.shelf').addClass('left');
    } else if (localStorage.getItem('shelfPos') == "saoC-radio") {
        $('.shelf').removeClass('right');
        $('.shelf').addClass('center');
        $('.shelf').removeClass('left');
    } else if (localStorage.getItem('shelfPos') == "saoR-radio") {
        $('.shelf').addClass('right');
        $('.shelf').removeClass('center');
        $('.shelf').removeClass('left');
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

function setTheme() {
    if (localStorage.getItem('theme') === 'dark') {
        $('.button').addClass('darkModeOn');

        $('.timeDate').addClass('darkModeOn');
        $('#cards').addClass('darkModeOn');
        $('.controlBtns').addClass('darkModeOn');
        $('.expandToggle').addClass('darkModeOn');

        $('.clockCard').addClass('darkModeOn');
        $('.calendarCard').addClass('darkModeOn');
        $('.shortcutCard').addClass('darkModeOn');
        $('.wallCard').addClass('darkModeOn');
    } else {
        $('.darkModeOn').removeClass('darkModeOn');
    }
}

function setDbg() {
    if (localStorage.getItem('debug') == 'true') {
        $('.dbg').addClass('enabled');
        $('#cbDebugCards').attr('checked', true)
    } else {
        $('.dbg').removeClass('enabled');
        $('#cbDebugCards').attr('checked', false)
    }
}

$('.wallCard').on('click', function () {
    refreshWall();
});

function refreshWall() {
    var wallFilter = localStorage.getItem('unsplashTags');
    fetch("https://source.unsplash.com/random/?sig=" + Math.round(Math.random) + wallFilter).then(data => {
        var backdropSample = data.url;

        $('body').css('background-image', $('#backDrop2').css('background-image'));
        $('.nv2').css('background-image', $('#backDrop2').css('background-image'));
        $('.wallCard').css('background-image', $('#backDrop2').css('background-image'));
        $('#backDrop2').delay(500).css('background-image', "url(" + backdropSample + ")");
    });
}

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

function weatherBalloon(cityID) {
    var key = localStorage.getItem('owmAPI');
    fetch('https://api.openweathermap.org/data/2.5/weather?id=' + cityID + '&appid=' + key)
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

// Wallpaper card / shelf alignment gestures (mobile only)

let touchstartX = 0
let touchendX = 0

function checkDirectionWC() {
    if (touchendX < touchstartX) {
        // left swipe
        if ($('.shelf').hasClass('right')) {
            $('#saoC-radio').click()
        } else if ($('.shelf').hasClass('center')) {
            $('#saoL-radio').click()
        }
    } else if (touchendX > touchstartX) {
        // right swipe
        if ($('.shelf').hasClass('left')) {
            $('#saoC-radio').click()
        } else if ($('.shelf').hasClass('center')) {
            $('#saoR-radio').click()
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

// Control panel gesture pill (mobile only)

function checkDirectionCC() {
    if (touchendX < touchstartX) {
        // left swipe
        if ($('.controlBtns').hasClass('expanded')) {
        } else {
            $('.expandToggle').click()
        }
    } else if (touchendX > touchstartX) {
        // right swipe
        if ($('.controlBtns').hasClass('expanded')) {
        } else {
            $('.expandToggle').click()
        }
    }
}

document.querySelector('.expandToggle').addEventListener('touchstart', e => {
    touchstartX = e.changedTouches[0].screenX
})

document.querySelector('.expandToggle').addEventListener('touchend', e => {
    touchendX = e.changedTouches[0].screenX
    checkDirectionCC()
})