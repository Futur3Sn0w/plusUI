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

// $('.controlPanel').on('wheel', function (e) {
//     if (e.originalEvent.deltaY > 10) {
//         console.log('right');
//     } else {
//         console.log('left');
//     }
// });


$('.ccb').on('mouseover', function () {
    $('.timeDate').addClass('static')
})

$('.ccb').on('mouseout', function () {
    $('.timeDate').removeClass('static')
})

$('.ccb:not(.rolodexOpen)').on('click', function (e) {
    var index = $(this).index();

    $('.controlPanelOptGroup').removeClass('visible');
    $('.controlPanelOptGroup').eq(index).addClass('visible');

    $('.ccb.selected').removeClass('selected')
    $(this).addClass('selected');

    e.stopPropagation();
})

// $('.controlPanel').on('scroll', function () {
// })

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
    alignShelfLabel();
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
        setTheme();
    } else if (localStorage.getItem('theme') == 'dark') {
        localStorage.setItem('theme', 'auto');
        setTheme();
    } else if (localStorage.getItem('theme') == 'auto') {
        localStorage.setItem('theme', 'light');
        setTheme();
    }
    $('.lightDark').attr('data-theme', localStorage.getItem('theme'));
});

// dcExpt group-b (1x1 buttons)

$('.fullscreenBtn').on('click', function () {
    if ($(this).hasClass('a')) {
        closeFullscreen();
    } else {
        openFullscreen()
    }
    $(this).toggleClass('a')
})

$('.refreshPageBtn').on('click', function () {
    window.location.reload();
})

$('#allowTextCardDarkMode').click(function () {
    if ($(this).is(':checked')) {
        $('.textCard').addClass('allowDark');
        localStorage.setItem('allowTextCardDarkMode', 'true');
    } else {
        $('.textCard').removeClass('allowDark');
        localStorage.setItem('allowTextCardDarkMode', 'false');
    }
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
// Custom backdrop

function customWall(input) {
    if ($('.customBackdrop').hasClass('hidden')) {
        if (input.files && input.files[0]) {

            var reader = new FileReader();

            reader.onload = function (e) {
                $('.customBackdrop').attr('src', e.target.result);
            }

            reader.readAsDataURL(input.files[0]);

            bannerImage = document.getElementById('customBackdrop');
            imgData = getBase64Image(bannerImage);
            localStorage.setItem("imgData", imgData);

            $('.customBackdrop').removeClass('hidden');
        }
    } else {
        $('.customBackdrop').addClass('hidden');
    }
}

function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    var dataURL = canvas.toDataURL("image/png");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

// Tilt

$('#cbDisablePara').on('click', function () {
    if ($('.parallax').hasClass('parallax-disabled')) {
        const tilt = $('.parallax').tilt();
        tilt.methods.destroy.call(tilt);
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
    if (localStorage.getItem('liveLink') == null) {
        localStorage.setItem('liveLink', 'https://flux.sandydoo.me')
    }
    if ($(this).is(':checked')) {
        localStorage.setItem('liveWall', 'true')
        $('<embed src="' + localStorage.getItem('liveLink') + '" type="">').appendTo('.siteDrop');
    } else {
        localStorage.setItem('liveWall', 'false')
        $('.siteDrop').children('embed').remove();
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
        $('.siteDrop').children('embed').attr('src', localStorage.getItem('liveLink'));
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
    $('.siteDrop').children('embed').attr('src', localStorage.getItem('liveLink'));
    $('#liveLinkTB').val(localStorage.getItem('liveLink'));
})

// Float mode

$('#cbFloatMode').click(function () {
    if ($(this).is(':checked')) {
        $('.shelf').addClass('float');
        localStorage.setItem('float', 'true');
    } else {
        $('.shelf').removeClass('float');
        localStorage.setItem('float', 'false');
    }
    alignShelfLabel();
});

// Monochrome mode

$('#cbMonoMode').click(function () {
    if ($(this).is(':checked')) {
        $('.subCards').addClass('plated');
        localStorage.setItem('monoCards', 'true');
    } else {
        $('.subCards').removeClass('plated');
        localStorage.setItem('monoCards', 'false');
    }
});

// timeCard time and date

function showTime() {
    var date = new Date();
    var h = date.getHours(); // 0 - 23
    var h2 = date.getHours(); // 0 - 23
    var h3 = date.getHours(); // 0 - 23
    var m = date.getMinutes(); // 0 - 59
    var tod = "";
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

    isDay = (ee == 'PM') ? "night" : "day"

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