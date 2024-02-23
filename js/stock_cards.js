// Weather (rejuv)

var tempUnit = localStorage.getItem('tempUnit');
var lat = localStorage.getItem('locLat');
var lon = localStorage.getItem('locLon');
let isDay;
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
    fetch('https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lon + '&current=temperature_2m,is_day,precipitation,weather_code&current_weather=true&timezone=auto')
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
    var wcFeel = weatherCodes[d.current_weather.weathercode];
    var feel = wcFeel.replace('Clear sky', 'Clear ' + tod);
    // alert(isDay)
    var tempPref;
    if (tempUnit == 'c') {
        tempPref = Math.round(d.current_weather.temperature);
    } else {
        tempPref = Math.round((d.current_weather.temperature * 1.8) + 32);
    }
    $('#temp').text(tempPref + "°")

    $('#weatherIcon').attr('src', "resc/weather/" + wcFeel.replace('Clear sky', 'Clear ' + isDay).replace(/\s+/g, "").toLowerCase() + '.svg');
    $('#temp').attr('feel', wcFeel.replace('Clear sky', 'Clear ' + tod))
    $('.cmi-tempUnit').attr('tempunit', tempUnit);
}

$('.cmi-tempUnit').click(function () {
    var newTempUnit = (tempUnit == "f") ? "c" : "f"
    tempUnit = newTempUnit;
    $('.cmi-tempUnit').attr('tempunit', tempUnit);
    localStorage.setItem('tempUnit', newTempUnit);

    weather()
})

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

// Calendar card (expanded view)

const daysTag = document.querySelector(".calendarCard .days"),
    currentDate = document.querySelector(".calendarCard .current-date"),
    prevNextIcon = document.querySelectorAll(".calendarCard .icons i");

// getting new date, current year and month
let date = new Date(),
    currYear = date.getFullYear(),
    currMonth = date.getMonth();

// storing full name of all months in array
const months = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];

const renderCalendar = () => {
    let firstDayofMonth = new Date(currYear, currMonth, 1).getDay(), // getting first day of month
        lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(), // getting last date of month
        lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(), // getting last day of month
        lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate(); // getting last date of previous month
    let liTag = "";

    for (let i = firstDayofMonth; i > 0; i--) { // creating li of previous month last days
        liTag += `<li class="inactive interactable-hov">${lastDateofLastMonth - i + 1}</li>`;
    }

    for (let i = 1; i <= lastDateofMonth; i++) { // creating li of all days of current month
        // adding active class to li if the current day, month, and year matched
        let isToday = i === date.getDate() && currMonth === new Date().getMonth()
            && currYear === new Date().getFullYear() ? "active" : "";
        liTag += `<li class="${isToday} interactable-hov">${i}</li>`;
    }

    for (let i = lastDayofMonth; i < 6; i++) { // creating li of next month first days
        liTag += `<li class="inactive interactable-hov">${i - lastDayofMonth + 1}</li>`
    }
    currentDate.innerText = `${months[currMonth]} ${currYear}`; // passing current mon and yr as currentDate text
    daysTag.innerHTML = liTag;
}
renderCalendar();

prevNextIcon.forEach(icon => { // getting prev and next icons
    icon.addEventListener("click", () => { // adding click event on both icons
        // if clicked icon is previous icon then decrement current month by 1 else increment it by 1
        currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

        if (currMonth < 0 || currMonth > 11) { // if current month is less than 0 or greater than 11
            // creating a new date of current year & month and pass it as date value
            date = new Date(currYear, currMonth, new Date().getDate());
            currYear = date.getFullYear(); // updating current year with new date year
            currMonth = date.getMonth(); // updating current month with new date month
        } else {
            date = new Date(); // pass the current date as date value
        }
        renderCalendar(); // calling renderCalendar function
    });
});

// Weather stars

const numberOfStars = 50;
const twinkleFrequencyMinimum = 2; // seconds
const twinkleFrequencyMaximum = 6; // ''

const constructUniverse = () => {

    for (let i = 0; i < numberOfStars; i++) {

        const xAxis = Math.floor(Math.random() * 180);
        const yAxis = Math.floor(Math.random() * 90);

        const star = $("<div></div>").addClass("star");
        star.css({
            top: yAxis,
            left: xAxis
        });
        $(".weather_stars").append(star);

    }

    const randomRange = (min, max) => {
        return Math.floor(Math.random() * (max + 1 - min) + min);
    };

    $(".star").each(function () {
        let randNum = randomRange(twinkleFrequencyMinimum, twinkleFrequencyMaximum);
        $(this).css("animation-duration", randNum + "s");
    });

};

const outputStars = () => {
    const starCollection = $(".star");
    if (starCollection.length === 0) {
        constructUniverse();
    } else {
        starCollection.remove();
        constructUniverse();
    }
};

let timerIsActive = false;

$(window).resize(() => {
    if (!timerIsActive) {
        timerIsActive = true;
        setTimeout(() => {
            outputStars();
            timerIsActive = false;
        }, 500);
    }
});

// Year progress card

var currentYear;
var daysLeft;

function getYearCompletionPercentage() {
    const today = new Date();
    currentYear = today.getFullYear();
    const daysInYear = isLeapYear(currentYear) ? 366 : 365;
    const daysPassed = today.getDate() + (today.getMonth() * 30) + (Math.floor(today.getDate() / 4) - Math.floor(today.getMonth() / 2));
    daysLeft = daysInYear - daysPassed;
    return Math.round((daysPassed / daysInYear) * 100);
}

function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

// Example usage
const percentage = getYearCompletionPercentage();
$('.yearProgCard .percLabel').attr("a", percentage + '%').attr('b', daysLeft + ' days');
// $('.yearProgCard .yearLabel').text(currentYear);
$('.yearProgCard .percBar .fill').css('width', percentage + '%');

// Copy character card

$(document).on('click', '.characterCopyCard .grid .gridItem', function () {
    var copyText = $(this).text().replace(/"/g, "");

    // Use Clipboard API for modern browsers
    if (navigator.clipboard) {
        navigator.clipboard.writeText(copyText)
            .then(() => {
                console.log("Copied symbol: " + copyText);
            })
            .catch(err => {
                console.error("Failed to copy symbol:", err);
                // Handle error gracefully, e.g., display a user-friendly message
            });
    } else {
        // Fallback for older browsers using execCommand
        $(this).select();
        document.execCommand("copy");
        console.log("Copied symbol: " + copyText);
    }
})