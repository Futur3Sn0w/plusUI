var wallFilter = localStorage.getItem('unsplashTags');
var backdropImg = 'https://source.unsplash.com/featured/?sig=' + Math.random() + wallFilter;

window.onload = function () {
    showTime();
    showDate();

    if (localStorage.getItem('debug') == true) {
        $('.dbg').addClass('enabled');
        $('#cbDebugCards').prop('checked', true);
    }

    setFullscreen();
    setTheme();
    setDbg();

    $('#backDrop').css('background-image', "url(" + backdropImg + ")");
    $('#backDrop2').css('background-image', "url(" + backdropImg + ")");
    $('body').css('background-image', "url(" + backdropImg + ")");
    refreshWall();
    setInterval("refreshWall();", 30000);

    setTimeout("cardSmarts();", 500);

    applyKeys();

    doTheBatteryThing();
    chargingIndic();
}

var lsOwmAPI = localStorage.getItem('owmAPI');
var lsOwmCity = localStorage.getItem('owmCity');

function submitKeys() {
    localStorage.setItem('owmAPI', $('#owmAPI').val());
    localStorage.setItem('owmCity', $('#owmCity').val());
    window.location.reload();
    // alert(lsOwmAPI + " " + lsOwmCity + " " + lsrssapp);
}

function applyKeys() {
    if (localStorage.getItem('owmAPI') == null) {
        $('.keys').css('display', 'flex');
        alert('The info below is required to enter.');
    } else if (localStorage.getItem('owmCity') == null) {
        $('.keys').css('display', 'flex');
        alert('The info below is required to enter.');
    } else {
        var lsOwmAPI = localStorage.getItem('owmAPI');
        var lsOwmCity = localStorage.getItem('owmCity');

        $('.keys').css('display', 'none');
        $('.tvUI').css('display', 'flex');

        console.log('Keys loaded sucessfully.');

        weatherBalloon(lsOwmCity);
        window.setInterval("weatherBalloon(lsOwmCity);", 10000);
    }
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

$('.fullScreen').on('click', function () {
    if (localStorage.getItem('fullscreen') == 'true') {
        localStorage.setItem('fullscreen', 'false');
        setFullscreen();
    } else {
        localStorage.setItem('fullscreen', 'true');
        setFullscreen();
    }
});

$('.reloadPage').on('click', function () {
    window.location.reload();
});

$('.expandToggle').on('click', function () {
    $('.controlBtns').toggleClass('visible');
    $('.expandToggle').toggleClass('expanded');
});

$('.scApp').on('click', function () {
    window.open('https://' + $(this).attr('data-launch') + '.com');
});

$('#unsplashTags').focusout(function () {
    localStorage.setItem('unsplashTags', '&' + $(this).val());
    refreshWall();
});

$('#zoomLvl').change(function () {
    $('.tvUI').css('transform', 'scale(' + $(this).val() + ')')
});

$(document).mouseup(function (e) {
    var element = $(".timeDate");
    var element2 = $(".controlBtns");
    var element3 = $(".expandToggle");
    var element4 = $(".keyTB");

    // if the target element is not expected element
    if (!element.is(e.target) && !element2.is(e.target) && !element3.is(e.target) && !element4.is(e.target)) {
        $('.controlBtns').removeClass('visible');
        $('.expandToggle').removeClass('expanded');
    }
});

$(document).mouseup(function (e) {
    var element = $(".editMode");
    var element2 = $(".card");

    // if the target element is not expected element
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
    var pp = $('.batteryText').attr('data-battLvl');

    if (pp >= "97") {
        $('.batteryText').text("");
        $('.batteryCard').addClass('square');
        $('.bciProg').css('width', "100%");
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

        $('.clockCard').addClass('darkModeOn');
        $('.calendarCard').addClass('darkModeOn');
    } else {
        $('.darkModeOn').removeClass('darkModeOn');
    }
}

function setFullscreen() {
    if (localStorage.getItem('fullscreen') == 'true') {
        $('.nonView').addClass('displayNone');
        $('.tvUI').addClass('tvFS');
    } else {
        $('.tvUI').removeClass('tvFS');
        $('.nonView').removeClass('displayNone');
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

        $('#backDrop').css('background-image', $('#backDrop2').css('background-image'));
        $('body').css('background-image', $('#backDrop2').css('background-image'));
        $('.nv2').css('background-image', $('#backDrop2').css('background-image'));
        $('.wallCard').css('background-image', $('#backDrop2').css('background-image'));
        $('#backDrop2').delay(700).css('background-image', "url(" + backdropSample + ")");
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