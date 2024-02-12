// Windows Insider card

// const rssUrl = "https://rss.app/feeds/lsUWpCbadyqdyXzI.xml";

// $.ajax({
//     url: rssUrl,
//     success: function (data) {
//         // find the element that contains the build number
//         var element = $(data).text();

//         var build = element.trim().match(/Build [0-9]{5}/); // returns ["string"]
//         var branch = element.trim().match(/[0-9]{5} to the .*? .*?/); // returns ["string"]
//         var firstBuild = build[0].replace('Build ', ''); // returns "string"
//         var firstBranch = branch[0].replace(/[0-9]{5} to the /, '');
//         // alert(firstMatch); // displays "string"

//         $('.icBuild').text(firstBuild);
//         $('.icBuild').attr('data-channel', firstBranch);
//         // alert(firstBranch)
//     }
// });

// Weather (rejuv)

var tempUnit = 'f';
var lat = localStorage.getItem('locLat');
var lon = localStorage.getItem('locLon');
const weatherCodes = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Depositing rime fog",
    51: "Light Drizzle",
    53: "Moderate Drizzle",
    55: "Dense Drizzle",
    56: "Light Freezing Drizzle",
    57: "Dense Freezing Drizzle",
    61: "Slight Rain",
    63: "Moderate Rain",
    65: "Heavy Rain",
    66: "Light Freezing Rain",
    67: "Heavy Freezing Rain",
    71: "Slight Snow fall",
    73: "Moderate Snow fall",
    75: "Heavy Snow fall",
    77: "Snow grains",
    80: "Slight Rain showers",
    81: "Moderate Rain showers",
    82: "Violent Rain showers",
    85: "Slight snow showers ",
    86: "Heavy snow showers ",
    95: "Thunderstorm with slight hail",
    96: "Thunderstorm with hail",
    99: "Thunderstorm with heavy hail"
};

function weather() {
    if (navigator.geolocation) {
        console.log("Geolocation is supported.");
        getLatLon().catch((error) => {
            console.log(`Error: ${error.message}`);
            $('.weatherCard').hide();
        });
    } else {
        console.log("Geolocation is not enabled and/or supported by this device.");
        $('.weatherCard').hide();
    }
    newWeatherBalloon(lat, lon);
    window.setInterval("newWeatherBalloon(lat, lon);", 10000);
}

async function getLatLon() {
    try {
        const response = await fetch(`http://ip-api.com/json`);
        const { lat, lon } = await response.json();

        localStorage.setItem("locLat", lat);
        localStorage.setItem("locLon", lon);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

function newWeatherBalloon() {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lon + '&daily=weathercode&current_weather=true&timezone=auto&forecast_days=1')
        .then(function (resp) { return resp.json() }) // Convert data to json
        .then(function (data) {
            $('.weatherCard').show();
            setTimeout(newDrawWeather(data), 10000);
        })
        .catch(function (error) {
            // location.reload();
            $('.weatherCard').hide();
            console.error('An error occurred:', error);
        });
}

function newDrawWeather(d) {
    var feel = weatherCodes[d.current_weather.weathercode];
    var tempPref;
    if (tempUnit == 'c') {
        tempPref = Math.round(d.current_weather.temperature);
    } else if (tempUnit == 'f') {
        tempPref = Math.round((d.current_weather.temperature * 1.8) + 32);
    }
    document.getElementById('temp').innerText = tempPref + '°';

    $('#weatherIcon').attr('src', "resc/weather/" + weatherCodes[d.current_weather.weathercode].replace(/\s+/g, "").toLowerCase() + '.svg');
    $('#temp').attr('feel', feel)
}

//

// Shortcuts

$('.scApp').on('click', function () {
    window.open('https://' + $(this).attr('data-url'));
});

// https://www.google.com/s2/favicons?domain=${domain}&sz=${size}

$(document).ready(function () {
    $('.scApp').each(function () {
        var url = 'https://' + $(this).attr('data-url');
        $(this).find('i').css('background-image', 'url(https://www.google.com/s2/favicons?domain=' + url + '&sz=32)');
    });
});

// Battery

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
    setTimeout(() => {
        if (navigator.getBattery()) {
            setInterval(() => {
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
            }, 5000);
        }
    }, 200);
}

// Analog clock

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

// Text/notes card

$('#textCardTB').on('keypress', function () {
    localStorage.setItem('textCard', $('#textCardTB').val());
})


// YTCard2 

var ytsearch = "https://www.youtube.com/results?search_query=";

$('.ytSearch').keypress(function (event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '13') {
        window.open(ytsearch + $('.ytSearch').val());
        $('.ytSearch').val('');
    }
});

// FS Card

// $('.snowCard').on('click', function (e) {
//     if ($(this).parent().hasClass('subCards')) {
//         window.open('https://futur3sn0w.me');
//     }
// })