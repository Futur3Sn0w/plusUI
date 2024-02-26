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

    if (localStorage.getItem('liveLink') == null) {
        localStorage.setItem('liveLink', 'https://flux.sandydoo.me')
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
}

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
        getLatLon().then(({ lat, lon }) => {
            if (lat !== null) {
                localStorage.setItem("locLat", lat);
                localStorage.setItem("locLon", lon);

                newWeatherBalloon(lat, lon);
            } else {
                $('.weatherCard').hide();
            }
        }).catch((error) => {
            console.log(`Error: ${error.message}`);
            $('.weatherCard').hide();
        });
    } else {
        console.log("Geolocation is not enabled and/or supported by this device.");
        $('.weatherCard').hide();
    }
}

async function getLatLon() {
    try {
        const response = await fetch(`http://ip-api.com/json`);
        const { lat, lon } = await response.json();

        return ({ lat, lon });
    } catch (error) {
        console.log(error);
        throw error;
    }
}

function newWeatherBalloon(lat, lon) {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lon + '&current=temperature_2m,is_day,precipitation,weather_code&current_weather=true&timezone=auto')
        .then(function (resp) { return resp.json() }) // Convert data to json
        .then(function (data) {
            $('.weatherCard').show();
            setTimeout(newDrawWeather(data), 5000);
        })
        .catch(function (error) {
            // location.reload();
            $('.weatherCard').hide();
            console.error('An error occurred:', error);
        });
    setInterval(() => {
        fetch('https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lon + '&current=temperature_2m,is_day,precipitation,weather_code&current_weather=true&timezone=auto')
            .then(function (resp) { return resp.json() }) // Convert data to json
            .then(function (data) {
                $('.weatherCard').show();
                setTimeout(newDrawWeather(data), 5000);
            })
            .catch(function (error) {
                // location.reload();
                $('.weatherCard').hide();
                console.error('An error occurred:', error);
            });
    }, 10000);
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

$('.cmi-clockCardStyle1').click(function () {
    $('.cmi-clockCardStyle').not(this).children('input').prop('checked', false);
    $('.clockCard').removeClass('style-b').addClass('style-a')
    localStorage.setItem('clockStyle', '1')
})

$('.cmi-clockCardStyle2').click(function () {
    $('.cmi-clockCardStyle').not(this).children('input').prop('checked', false);
    $('.clockCard').removeClass('style-a').addClass('style-b')
    localStorage.setItem('clockStyle', '2')
})

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

$('.calendarCard').click(function () {
    if ($(this).parent().hasClass('subCards') && !$(this).parent().hasClass('editMode')) {
        $(this).addClass('context-selected-card');
        $('.cmi-expand').click();
    }
})

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
        let randZ = randomRange(-15, 15);
        $(this).css("animation-duration", randNum + "s");
        $(this).css("transform", 'translateZ(' + randZ + 'px)');
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

// Emoji card

var emojis = [
    '😄', '😃', '😀', '😊', '😉', '😍', '😘', '😚', '😗', '😙', '😜', '😝', '😛', '😳', '😁', '😔', '😌',
    '😒', '😞', '😣', '😢', '😂', '😭', '😪', '😥', '😰', '😅', '😓', '😩', '😫', '😨', '😱', '😠', '😡', '😤',
    '😖', '😆', '😋', '😷', '😎', '😴', '😵', '😲', '😟', '😦', '😧', '😈', '👿', '😮', '😬', '😐', '😕', '😯',
    '😶', '😇', '😏', '👩', '👴', '👵', '👱', '👼', '👸', '😺', '😸', '😻', '😽', '😼', '🙀', '😿', '😹', '😾',
    '👹', '👺', '🙈', '🙉', '🙊', '💀', '👽', '💩', '🔥', '✨', '🌟', '💫', '💥', '💢', '💦', '💧', '💤', '💨',
    '👂', '👀', '👃', '👅', '👄', '👍', '👎', '👌', '👊', '✊', '✌', '👋', '✋', '👐', '👆', '👇', '👉', '👈',
    '🙌', '🙏', '👏', '💪', '🚶', '🏃', '💃', '👫', '👪', '👬', '👭', '💏', '💑', '👯', '🙆', '🙅', '💁',
    '🙋', '💆', '💇', '💅', '👰', '🙎', '🙍', '🙇', '🎩', '👑', '👒', '👟', '👞', '👡', '👠', '👢', '👕', '👔',
    '👚', '👗', '🎽', '👖', '👘', '👙', '💼', '👜', '👝', '👛', '👓', '🎀', '🌂', '💄', '💛', '💙', '💜', '💚',
    '💔', '💗', '💓', '💕', '💖', '💞', '💘', '💌', '💋', '💍', '💎', '👤', '👥', '💬', '👣', '💭', '🐶',
    '🐺', '🐱', '🐭', '🐹', '🐰', '🐸', '🐯', '🐨', '🐻', '🐷', '🐽', '🐮', '🐗', '🐵', '🐒', '🐴', '🐑', '🐘',
    '🐼', '🐧', '🐦', '🐤', '🐥', '🐣', '🐔', '🐍', '🐢', '🐛', '🐝', '🐜', '🐞', '🐌', '🐙', '🐚', '🐠', '🐟',
    '🐬', '🐳', '🐋', '🐄', '🐏', '🐀', '🐃', '🐅', '🐇', '🐉', '🐎', '🐐', '🐓', '🐕', '🐖', '🐁', '🐂', '🐲',
    '🐡', '🐊', '🐫', '🐪', '🐆', '🐈', '🐩', '🐾', '💐', '🌸', '🌷', '🍀', '🌹', '🌻', '🌺', '🍁', '🍃', '🍂',
    '🌿', '🌾', '🍄', '🌵', '🌴', '🌲', '🌳', '🌰', '🌱', '🌼', '🌐', '🌞', '🌝', '🌚', '🌑', '🌒', '🌓', '🌔',
    '🌕', '🌖', '🌗', '🌘', '🌜', '🌛', '🌙', '🌍', '🌎', '🌏', '🌋', '🌌', '🌠', '⭐', '⛅', '⛄', '🌀',
    '🌁', '🌈', '🌊', '🎍', '💝', '🎎', '🎒', '🎓', '🎏', '🎆', '🎇', '🎐', '🎑', '🎃', '👻',
    '🎅', '🎄', '🎁', '🎋', '🎉', '🎊', '🎈', '🎌', '🔮', '🎥', '📷', '📹', '📼', '💿', '📀', '💽', '💾', '💻',
    '📱', '📞', '📟', '📠', '📡', '📺', '📻', '🔊', '🔉', '🔈', '🔇', '🔔', '🔕', '📢', '📣', '⏳', '⌛',
    '⏰', '⌚', '🔓', '🔒', '🔏', '🔐', '🔑', '🔎', '💡', '🔦', '🔌', '🔋', '🔍', '🛁', '🛀', '🚿',
    '🚽', '🔧', '🔩', '🔨', '🚪', '🚬', '💣', '🔫', '🔪', '💊', '💉', '💰', '💴', '💵', '💷', '💶', '💳', '💸',
    '📲', '📧', '📥', '📤', '📩', '📨', '📯', '📫', '📪', '📬', '📭', '📮', '📦', '📝', '📄', '📃', '📑',
    '📊', '📈', '📉', '📜', '📋', '📅', '📆', '📇', '📁', '📂', '✂', '📌', '📎', '📏', '📐', '📕', '📗',
    '📘', '📙', '📓', '📔', '📒', '📚', '📖', '🔖', '📛', '🔬', '🔭', '📰', '🎨', '🎬', '🎤', '🎧', '🎼', '🎵',
    '🎶', '🎹', '🎻', '🎺', '🎷', '🎸', '👾', '🎮', '🃏', '🎴', '🀄', '🎲', '🎯', '🏈', '🏀', '⚽', '⚾', '🎾',
    '🎱', '🏉', '🎳', '⛳', '🚵', '🚴', '🏁', '🏇', '🏆', '🎿', '🏂', '🏊', '🏄', '🎣', '🍵', '🍶', '🍼',
    '🍺', '🍻', '🍸', '🍹', '🍷', '🍴', '🍕', '🍔', '🍟', '🍗', '🍖', '🍝', '🍛', '🍤', '🍱', '🍣', '🍥', '🍙',
    '🍘', '🍚', '🍜', '🍲', '🍢', '🍡', '🍳', '🍞', '🍩', '🍮', '🍦', '🍨', '🍧', '🎂', '🍰', '🍪', '🍫', '🍬',
    '🍭', '🍯', '🍎', '🍏', '🍊', '🍋', '🍒', '🍇', '🍉', '🍓', '🍑', '🍈', '🍌', '🍐', '🍍', '🍠', '🍆', '🍅',
    '🌽', '🏠', '🏡', '🏫', '🏢', '🏣', '🏥', '🏦', '🏪', '🏩', '🏨', '💒', '⛪', '🏬', '🏤', '🌇', '🌆', '🏯',
    '🏰', '⛺', '🏭', '🗼', '🗾', '🗻', '🌄', '🌅', '🌃', '🗽', '🌉', '🎠', '🎡', '⛲', '🎢', '🚢', '⛵', '🚤',
    '🚣', '🚀', '💺', '🚁', '🚂', '🚊', '🚉', '🚞', '🚆', '🚄', '🚅', '🚈', '🚇', '🚝', '🚋', '🚃',
    '🚎', '🚌', '🚍', '🚙', '🚘', '🚗', '🚕', '🚖', '🚛', '🚚', '🚨', '🚓', '🚔', '🚒', '🚑', '🚐', '🚲', '🚡',
    '🚟', '🚠', '🚜', '💈', '🚏', '🎫', '🚦', '🚥', '🚧', '🔰', '⛽', '🏮', '🎰', '🗿', '🎪', '🎭',
    '📍', '🚩', '🔠', '🔡', '🔤', '🔄', '🔼', '🔽', 'ℹ', '⏪', '⏩', '⏫', '⏬', '🆗', '🔀', '🔁', '🔂', '🆕',
    '🆙', '🆒', '🆓', '🆖', '📶', '🎦', '🈁', '🈯', '🈳', '🈵', '🈴', '🈲', '🉐', '🈹', '🈺', '🈶', '🈚', '🚻',
    '🚹', '🚺', '🚼', '🚾', '🚰',
    '🚮', '🅿', '🚭', '🈸', '🛂', '🛄', '🛅', '🛃', '🉑', '🆑', '🆘', '🆔', '🚫',
    '🔞', '📵', '🚯', '🚱', '🚳', '🚷', '🚸', '⛔', '❎', '✅', '💟', '🆚', '📳', '📴',
    '🆎', '💠', '⛎', '🔯', '🏧', '💹', '❌', '⭕', '❗', '❓', '❕', '❔', '🔃', '🕛', '➕', '➖',
    '➗', '💮', '💯', '🔘', '🔗', '➰', '🔱', '🔲', '🔳', '🔺', '⬜', '⬛', '⚫', '⚪', '🔴',
    '🔵', '🔻', '🔶', '🔷', '🔸', '🔹'
];

function elc() {
    setInterval(() => {
        var current = emojis[Math.floor(Math.random() * emojis.length)];
        $('.emojiLocaleCard p').text(current);
    }, 5000);
}

$('.emojiLocaleCard').on('click', function () {
    if ($(this).parent().hasClass('subCards') && !$(this).parent().hasClass('editMode')) {
        $(this).addClass('context-selected-card');
        $('.cmi-expand').click();
    }
})

$(document).ready(function () {
    emojis.forEach(emoji => {
        $('<div class="emojiItem interactable-hov">').attr('text', emoji).appendTo('.emojiLocaleCard .list');
    });
});

$(document).on('click', '.emojiItem', function () {
    var copyText = $(this).text();

    // Use Clipboard API for modern browsers
    if (navigator.clipboard) {
        navigator.clipboard.writeText(copyText)
            .then(() => {
                console.log("Copied emoji: " + copyText);
                $('.emojiLocaleCard .expView').attr("text", "Copied")
                setTimeout(() => {
                    $('.emojiLocaleCard .expView').attr("text", "Click to copy")
                }, 5000);
            })
            .catch(err => {
                console.error("Failed to copy emoji:", err);
                // Handle error gracefully, e.g., display a user-friendly message
            });
    } else {
        // Fallback for older browsers using execCommand
        $(this).select();
        document.execCommand("copy");
        console.log("Copied emoji: " + copyText);
    }
})

// Doggy card

function doggyCard() {
    $.ajax({
        url: "https://dog.ceo/api/breeds/image/random", // Replace with your actual API endpoint
        dataType: "json", // Specify data type as JSON
        success: function (data) {
            // Set the image URL for the element
            $(".pupperCard img").attr("src", data.message);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("Error fetching image:", textStatus, errorThrown);
            // Handle errors appropriately, e.g., display an error message
            $('.pupperCard').remove();
        }
    });
}

doggyCard();

$('.doggyCard').click(function () {
    if ($(this).parent().hasClass('subCards') && !$(this).parent().hasClass('editMode')) {
        doggyCard();
    }
})

// Catto card

function cattoCard() {
    const imageElement = document.querySelector('.cattoCard img');

    fetch('https://placekitten.com/200/300')
        .then(response => {
            // Check for successful response
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.blob();
        })
        .then(blob => {
            const imageUrl = URL.createObjectURL(blob);

            // Set the image source
            imageElement.src = imageUrl;

            // Remember to revoke the object URL when no longer needed
            imageElement.onload = () => URL.revokeObjectURL(imageUrl);
        })
        .catch(error => {
            console.error(error);
            $('.cattoCard').remove();
        });
}

cattoCard();

$('.cattoCard').click(function () {
    if ($(this).parent().hasClass('subCards') && !$(this).parent().hasClass('editMode')) {
        cattoCard();
    }
})

// NASA card

function nasaCard() {
    const randomDate = getRandomDate();
    var nasaURL = "https://api.nasa.gov/planetary/apod?api_key=oP0tzzSuhXvoNURURjkHU9ew16bKEY0CF3nzuK9W&date=" + randomDate;

    $.ajax({
        url: nasaURL, // Replace with your actual API endpoint
        dataType: "json", // Specify data type as JSON
        success: function (data) {
            // Set the image URL for the element
            $(".nasaCard img").attr("src", data.hdurl);
            $(".nasaCard").attr("data-subLbl", data.title);
            $(".nasaCard").attr("data-imgDate", data.date);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("Error fetching image:", textStatus, errorThrown);
            $('.nasaCard').remove();
        }
    });
}

nasaCard();

function getRandomDate() {
    // Set the minimum and maximum dates in milliseconds
    const minDate = new Date(1995, 5, 16).getTime();
    const maxDate = new Date().getTime();

    // Generate a random number between the minimum and maximum dates
    const randomDate = Math.floor(Math.random() * (maxDate - minDate + 1)) + minDate;

    // Create a new Date object from the random milliseconds
    const date = new Date(randomDate);

    // Format the date in YYYY-MM-DD format
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

$('.nasaCard').click(function () {
    if ($(this).parent().hasClass('subCards') && !$(this).parent().hasClass('editMode')) {
        nasaCard();
    }
})

// Useless facts card

function uselessFactsCard() {
    $.ajax({
        url: "https://uselessfacts.jsph.pl/api/v2/facts/random",
        dataType: "json", // Specify data type as JSON
        success: function (data) {
            $('.uselessFactsCard .fact').remove();
            $('.uselessFactsCard .source').remove();

            // Set the image URL for the element
            $('<div>').addClass('fact').text(data.text).appendTo('.uselessFactsCard');
            $('<div>').addClass('source').text(data.source).appendTo('.uselessFactsCard');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("Error fetching data:", textStatus, errorThrown);
            $('.uselessFactsCard').remove();
        }
    });
}

uselessFactsCard();

$('.uselessFactsCard').click(function () {
    if ($(this).parent().hasClass('subCards') && !$(this).parent().hasClass('editMode')) {
        $(this).addClass('context-selected-card');
        $('.cmi-expand').click();
    }
})

$('.cmi-ufCardRefresh').on('click', function () {
    uselessFactsCard();
})

// Calculator card

$('.calcBtn').on('click', function () {
    var val = $(this).attr('value');
    if (val == 'c') {
        $('.calcResult').val("0");
    } else if (val == '=') {
        let x = $('.calcResult').val();
        let y = eval(x)
        $('.calcResult').val(y)
    } else {
        if ($(".calcResult").val() == '0') {
            if ($.isNumeric(val)) {
                $(".calcResult").val(val);
            } else {
                $(".calcResult").val($(".calcResult").val() + val);
            }
        } else {
            $(".calcResult").val($(".calcResult").val() + val);
        }
    }
})