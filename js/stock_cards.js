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

// Weather

var lsOwmAPI = "984b3d6c3b801e60a2eaf094da08b866";
var lsOwmCity = "4791259";

function applyKeys() {
    // weatherBalloon(lsOwmCity);
    // window.setInterval("weatherBalloon(lsOwmCity);", 10000);
}

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

//

// Shortcuts

$('.scApp').on('click', function () {
    window.open('https://' + $(this).attr('data-launch') + '.com');
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