$('.timeDate').on('click', function () {
    if ($('.controlPanel').hasClass('expanded')) {
        $('.controlPanel').removeClass('expanded')
        $('.timeDate').removeClass('ccOpen')

    } else {
        $('.controlPanel').addClass('expanded')
        $('.timeDate').addClass('ccOpen')

        if (!$('.controlPanelOptGroup').eq(0).hasClass('selected')) {
            $('.ccb1').click();
        }
    }
});

$('.ccb').on('mouseover', function () {
    $('.timeDate').addClass('static')
})

$('.ccb').on('mouseout', function () {
    $('.timeDate').removeClass('static')
})

$('.ccb:not(.rolodexOpen)').on('click', function (e) {
    aboutStats();
    var index = $(this).index();

    $('.controlPanelOptGroup').removeClass('visible');
    $('.controlPanelOptGroup').eq(index).addClass('visible');

    $('.ccb.selected').removeClass('selected')
    $(this).addClass('selected');

    e.stopPropagation();
})

// User name stuff

$('#userNameTextbox').on('keyup', function (event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    localStorage.setItem('username', $('#userNameTextbox').val());
    userNameSet();
    if (keycode == '13') {
        $('.greeting').removeClass('hidden');
        setTimeout(() => {
            $('.greeting').addClass('hidden');
        }, 5000);
    }
});

function userNameSet() {
    if (!localStorage.getItem('username') == '') {
        $('.greeting').attr('data-username', localStorage.getItem('username'));
        $('#userNameTextbox').val(localStorage.getItem('username'));
    } else {
        localStorage.setItem('username', 'User');
    }
}

// Switch theme function

function setTheme() {
    if (localStorage.getItem('theme') == 'light') {
        $('.darkModeOn').removeClass('darkModeOn');
    } else if (localStorage.getItem('theme') == 'dark') {
        $('.button').addClass('darkModeOn');
        $('.shelf').addClass('darkModeOn');
        $('.shelfBack').addClass('darkModeOn');
        $('.expandableWindow').addClass('darkModeOn');

        $('.surface').addClass('darkModeOn');

        $('.clockCard').addClass('darkModeOn');
        $('.calendarCard').addClass('darkModeOn');
        $('.shortcutCard').addClass('darkModeOn');
        $('.modal-about').addClass('darkModeOn');
        $('.controlPanel').addClass('darkModeOn');
    } else if (localStorage.getItem('theme') == 'auto') {
        $('.darkModeOn').removeClass('darkModeOn');
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            $('.button').addClass('darkModeOn');
            $('.shelf').addClass('darkModeOn');
            $('.shelfBack').addClass('darkModeOn');
            $('.expandableWindow').addClass('darkModeOn');

            $('.surface').addClass('darkModeOn');

            $('.clockCard').addClass('darkModeOn');
            $('.calendarCard').addClass('darkModeOn');
            $('.shortcutCard').addClass('darkModeOn');
            $('.modal-about').addClass('darkModeOn');
            $('.controlPanel').addClass('darkModeOn');
        } else {
            $('.darkModeOn').removeClass('darkModeOn');
        }
    } else {
        $('.darkModeOn').removeClass('darkModeOn');
    }
    $('.aboutChanges object').prop('data', 'changelog.html');
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    setTheme();
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

$('#unsplashTags').focusout(function () {
    refreshWall();
});

$('#unsplashTags').keyup(function (event) {
    localStorage.setItem('unsplashTags', $(this).val());
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '13') {
        refreshWall();
    }
});

$('.lightDark').on('click', function () {
    if (localStorage.getItem('theme') == 'light') {
        localStorage.setItem('theme', 'dark');
    } else if (localStorage.getItem('theme') == 'dark') {
        localStorage.setItem('theme', 'auto');
    } else if (localStorage.getItem('theme') == 'auto') {
        localStorage.setItem('theme', 'light');
    }
    setTheme();
    $('.lightDark').attr('data-theme', localStorage.getItem('theme'));
});

// dcExpt group-b (1x1 buttons)

$('.fullscreenBtn').on('click', function () {
    innerHeight == screen.height ? closeFullscreen() : openFullscreen();
})

$('.refreshPageBtn').on('click', function () {
    location.reload();
})

$('#allowTextCardDarkMode').click(function () {
    $(this).is(':checked') ? $('.textCard').addClass('allowDark') : $('.textCard').removeClass('allowDark');
    localStorage.setItem('allowTextCardDarkMode', $(this).is(':checked'));
});

/* View in fullscreen */

var elem = document.documentElement;

function openFullscreen() {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
    }
}

function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
    }
}

// Live display

// Technically the below works, but all but 1 of the currently listed presets returns nothing :(

// $(document).ready(function () {
//     $('.liveLinkPreset').each(function () {
//         var url = $(this).attr('url');
//         $(this).find('i').css('background-image', 'url(https://www.google.com/s2/favicons?domain=' + url + '&sz=16)');
//     });
// });

// The below will set the icon of each preset to the first letter of it's name, as set in it's label

$(document).ready(function () {
    $('.liveLinkPreset').find('.fa-solid').each(function () {
        $(this).addClass('fa-' + $(this).siblings('label').text().charAt(0).toLowerCase());
    });
});

$('#siteDropToggle').click(function () {
    localStorage.setItem('liveWall', $(this).is(':checked'))
    if ($(this).is(':checked')) {
        $('<embed class="siteDrop" src="' + localStorage.getItem('liveLink') + '" type="">').appendTo('body');
    } else {
        $('.siteDrop').remove();
        $('#backDrop2').css('background-image', "url(resc/dark.png)");
        $('body').css('background-image', "url(resc/dark.png)");
    }
})

$('#liveLinkTB').on('keyup', function (event) {
    ldURLMatch();
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '13') {
        localStorage.setItem('liveLink', $('#liveLinkTB').val());
        if (localStorage.getItem('liveLink') == '') {
            localStorage.setItem('liveLink', 'https://flux.sandydoo.me');
        }
        $('.siteDrop').attr('src', localStorage.getItem('liveLink'));
    }
});

function ldURLMatch() {
    $('.liveLinkPreset').each(function () {
        if ($(this).is('[url="' + $('#liveLinkTB').val() + '"]')) {
            $(this).find('input').prop('checked', true)
                .closest('.liveLinkPreset').siblings().find('input').prop('checked', false);
            localStorage.setItem('liveLink', $(this).attr('url'));
            return;
        } else {
            $('.liveLinkPreset input').prop('checked', false);
            localStorage.setItem('liveLink', $('#liveLinkTB').val());
        }
    });
}

$('.liveLinkPreset').click(function () {
    localStorage.setItem('liveLink', $(this).attr('url'));
    $('.siteDrop').attr('src', localStorage.getItem('liveLink'));
    $('#liveLinkTB').val(localStorage.getItem('liveLink'));
})

// Float mode

$('#cbFloatMode').click(function () {
    $(this).is(':checked') ? $('.shelf').addClass('float') : $('.shelf').removeClass('float');
    localStorage.setItem('float', $(this).is(':checked'));

});

// Monochrome mode

$('#cbMonoMode').click(function () {
    $(this).is(':checked') ? $('.subCards').addClass('plated') : $('.subCards').removeClass('plated');
    localStorage.setItem('monoCards', $(this).is(':checked'));
});

// About stuff

function aboutStats() {
    // For easier troubleshooting in the future and for anyone reading the code, the below will include verbose comments+info

    // This function creates a unique 'debug code' that can be shared (by clicking it) to better assist in debugging and troubleshooting

    // First, empty the container:
    $('.debugCode').empty();

    // Number of cards PlusUI has successfully loaded:
    $('.debugCode').append($('.card').not('.placeholderCard').length + "l:");

    // Number of cards successfully restored to the shelf:
    $('.debugCode').append($('.subCards .card').not('.placeholderCard').length + "s:");

    // Number of cards remaining in rolodex:
    $('.debugCode').append($('.cbs1 .card').not('.placeholderCard').length + "r:");

    // Number of potentially failed-to-load cards:
    var loaded = $('.subCards .card:visible').not('.placeholderCard').length + $('.cbs1 .card:visible').not('.placeholderCard').length;
    $('.debugCode').append(($('.card').not('.placeholderCard').length - loaded) + "p:");

    // Is siteDrop currently enabled:
    $('.debugCode').append($('.siteDrop').length ? "sd:" : "");

    // Use navigator.useragent to get additional browser info (unreliable, consider migrating)
    var plat = (navigator.userAgent.match(/Macintosh|Win|Linux|Android/) || [''])[0];
    var browser = (navigator.userAgent.match(/Chrome|Firefox|Safari|Edge/) || [''])[0];
    $('.debugCode').append(plat.charAt(0) + ":" + browser.charAt(0));
}

$(document).on('click', '.aboutStats .debugCode', function () {
    var copyText = $(this).text().toUpperCase();

    // Use Clipboard API for modern browsers
    if (navigator.clipboard) {
        navigator.clipboard.writeText(copyText)
            .then(() => {
                console.log("Copied debug code: " + copyText);
                $('.aboutStats').attr('cc', 'Debug code (Copied)');
                setTimeout(() => {
                    $('.aboutStats').attr('cc', 'Debug code (Click to copy)');
                }, 5000);
            })
            .catch(err => {
                console.error("Failed to copy debug code:", err);
                // Handle error gracefully, e.g., display a user-friendly message
            });
    } else {
        // Fallback for older browsers using execCommand
        $(this).select();
        document.execCommand("copy");
        console.log("Copied debug code: " + copyText);
        $('.aboutStats').attr('cc', 'Debug code (Copied)');
        setTimeout(() => {
            $('.aboutStats').attr('cc', 'Debug code (Click to copy)');
        }, 5000);
    }
})

// timeCard time and date

let tod

function showTime() {
    var date = new Date();
    var h = date.getHours(); // 0 - 23
    var h2 = date.getHours(); // 0 - 23
    var h3 = date.getHours(); // 0 - 23
    var m = date.getMinutes(); // 0 - 59
    var ee = "";

    if (h2 < 12) {
        tod = "morning";
    } else if (h2 == 12 || h2 < 17) {
        tod = "afternoon";
    } else if (h2 > 17 || h2 == 17) {
        tod = "evening";
    }

    if (h3 < 12) {
        ee = "AM";
    } else if (h3 >= 12) {
        ee = "PM";
    }

    isDay = (h3 >= 17) ? "night" : "day"

    if (h == 0) {
        h = 12;
    }

    if (h > 12) {
        h = h - 12;
    }

    m = (m < 10) ? "0" + m : m;

    var time = h + ":" + m + " " + ee;
    var greetingMain = tod + ',';
    $('.greeting').text(greetingMain);
    document.getElementById("time").innerText = time;

    $('.weatherCard #temp').attr('tod', isDay)

    setTimeout(showTime, 5000);
}

function showDate() {
    const localDate = new Date();
    const monthsLong = [
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

    const daysLong = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];

    const monthsShort = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];

    const daysShort = [
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
    ];

    const currentDayShort = daysShort[localDate.getDay()];
    const currentDayLong = daysLong[localDate.getDay()];
    const currentDate = localDate.getDate();
    const currentMonthShort = monthsShort[localDate.getMonth()];
    const currentMonthLong = monthsLong[localDate.getMonth()];
    const currentYear = localDate.getFullYear();
    // document.getElementById('date').innerText = currentDay + ", " + currentMonth + " " + currentDate;

    $('.calendarCard .calenMonth').text(currentMonthShort);
    $('.calendarCard .calenDayNo').text(currentDate);
    $('.calendarCard .calenDay').text(currentDayShort);
}