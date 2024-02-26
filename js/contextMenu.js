// NOTE:
// Cards with their own options are setup under their respective section in stock_cards

// Setup the context menu

$('.card').on('contextmenu', function (e) {
    e.preventDefault();
    if (!$(this).hasClass('deckCard') && !$(this).hasClass('expanded')) {
        cardContextMenu(this);
    }
});

// Call to hide the context menu

function hideContextMenu() {
    $('.context-selected-card').addClass('temp').removeClass('context-selected-card');
    setTimeout(() => {
        $('.cmSep').children().appendTo('.card.temp .cardOptions');
    }, 300);
    $('.subCards').removeClass('freeze');
    $('.contextMenuDiv').removeClass('show');
    $('.subCards').removeClass('editMode');
    $('.subCards').sortable('enable');
    $('.subCards').sortable('refresh');

}

// Card context menu function

function cardContextMenu(e) {
    if ($(e).hasClass('squareCard')) {
        var cardSize = 'Larger'
        $('#cmi-resize-icn').addClass('fa-up-right-and-down-left-from-center').removeClass('fa-down-left-and-up-right-to-center');
    } else if ($(e).hasClass('rectCard')) {
        var cardSize = 'Smaller'
        $('#cmi-resize-icn').addClass('fa-down-left-and-up-right-to-center').removeClass('fa-up-right-and-down-left-from-center');
    }

    if ($(e).attr('data-expandableCard') == 'y') {
        $('.cmi-expand').removeClass('override-hidden');
    } else {
        $('.cmi-expand').addClass('override-hidden');
    }

    $('.context-selected-card').removeClass('context-selected-card');

    if (!$(e).parent().hasClass('editMode')) {
        if (cardSize == 'else' || $(e).attr('data-resizableCard') == 'n') {
            $('.cmi-resize').addClass('override-hidden');
        } else {
            $('.cmi-resize').removeClass('override-hidden');
        }
        $(e).addClass('context-selected-card');

        if ($(e).children().hasClass('cardOptions')) {
            $('.cmSep').addClass('custom');
            $(e).children('.cardOptions').children().appendTo($('.cmSep'));
        } else {
            $('.cmSep').removeClass('custom');
        }

        $('.cmi-resize').attr('data-btnLabel', cardSize);
        $('.cmi-expand').attr('data-btnLabel', 'Expand ' + $('.context-selected-card').attr('data-friendlyName'));
        // $('.cmi-disableCard').attr('data-btnLabel', $('.context-selected-card').attr('data-friendlyName'));

        var leftPosi = ($('.context-selected-card').offset().left + 2 + ($('.context-selected-card').width() / 2)) - (($(".contextMenuDiv").outerWidth() / 2));
        $(".contextMenuDiv").css("left", leftPosi + "px");
        $('.contextMenuDiv').addClass('show');
    }

    setTimeout(() => {
        $('.subCards').addClass('freeze');
    }, 500);
}

// Individual menu buttons

$('.cmi-resize').on('click', function () {
    if ($('.context-selected-card').hasClass('rectCard')) {
        $('.context-selected-card').addClass('squareCard').removeClass('rectCard');
        var card = $('.context-selected-card').attr('id');
        localStorage.setItem(card + '-size', 'squareCard')

        $(this).attr('data-btnLabel', 'Larger');
        $(this).children('#cmi-resize-icn').addClass('fa-up-right-and-down-left-from-center').removeClass('fa-down-left-and-up-right-to-center');
    } else if ($('.context-selected-card').hasClass('squareCard')) {
        $('.context-selected-card').addClass('rectCard').removeClass('squareCard');
        var card = $('.context-selected-card').attr('id');
        localStorage.setItem(card + '-size', 'rectCard')

        $(this).attr('data-btnLabel', 'Smaller');
        $(this).children('#cmi-resize-icn').addClass('fa-down-left-and-up-right-to-center').removeClass('fa-up-right-and-down-left-from-center');
    }

    // $('.cmi-resize').attr('data-btnLabel', cardSize);
    // $('.cmi-expand').attr('data-btnLabel', 'Expand ' + $('.context-selected-card').attr('data-friendlyName'));

    setTimeout(() => {
        var leftPosi = ($('.context-selected-card').offset().left + 2 + ($('.context-selected-card').width() / 2)) - (($(".contextMenuDiv").outerWidth() / 2));
        $(".contextMenuDiv").css("left", leftPosi + "px");
    }, 250);

    alignShelfLabel();
});

$('.cmi-expand').on('click', function () {
    $('.context-selected-card').addClass('removing');

    var placeholderCard = $('<div class="card placeholderCard"><i class="fa-solid fa-chevron-up"></i></div>');

    if ($('.context-selected-card').attr("class").indexOf("rectCard") !== -1) {
        placeholderCard.addClass("rectCard");
    } else if ($('.context-selected-card').attr("class").indexOf("squareCard") !== -1) {
        placeholderCard.addClass("squareCard");
    } else if ($('.context-selected-card').attr("class").indexOf("circleCard") !== -1) {
        placeholderCard.addClass("circleCard");
    }
    placeholderCard.attr('returnCard', $('.context-selected-card').attr('id'));

    setTimeout(() => {
        $('.context-selected-card').removeClass('removing');
        $('.context-selected-card').after(placeholderCard);
        if ($('.context-selected-card').parent().hasClass('subCards')) {
            var elementToMove = $('.context-selected-card');

            elementToMove.addClass('expanded');

            var expandableWindow = $('<div class="expandableWindow visible">');
            expandableWindow.attr('cardName', elementToMove.attr('data-friendlyName')).attr('returnCard', $('.context-selected-card').attr('id'));
            var windowOpts = $('<div class="windowOpts">').appendTo(expandableWindow);

            var returnBtn = $('<div class="return interactable-hov">');
            $('<i class="fa-solid fa-close">').appendTo(returnBtn);
            returnBtn.appendTo(windowOpts);
            $('<div class="grabber">').appendTo(expandableWindow.children('.windowOpts'));
            windowOpts.appendTo(expandableWindow);

            expandableWindow.appendTo('.eWinSurface');

            elementToMove.appendTo(expandableWindow);

            expandableWindow.draggable({
                containment: "parent",
                handle: ".windowOpts"
            })
        }

        hideContextMenu();
        setTheme();
        dockRadi();
        $('.shelfLabel').attr('subLbl', '').text(elementToMove.attr('data-friendlyName') + " expanded").addClass('show');
        alignShelfLabel();
    }, 250);

    setTimeout(() => {
        $('.shelfLabel').removeClass('show')
        alignShelfLabel();
    }, 5000);
})

$('.cmi-editMode').click(function (e) {
    hideContextMenu();

    $('.subCards').addClass('editMode');
    $('.subCards').sortable('enable');
    alignShelfLabel();
});

$('.cmi-disableCard').on('click', function () {
    var friendlyName = $('.card.context-selected-card').attr('data-friendlyName');

    $('.context-selected-card').addClass('removing');
    setTimeout(() => {
        $('.context-selected-card').addClass('deckCard');
        $('.context-selected-card').attr('data-enabled', 'n');
        // $('.context-selected-card').attr('data-index', '');
        $('.context-selected-card').appendTo($('.cbSect.cbs1'));
        $('.context-selected-card').removeClass('removing');
        $('.context-selected-card').removeClass('context-selected-card');

        $(".card").each(function (i, e) {
            var enabled = $(this).attr('data-enabled');
            var card = $(e).attr('id');

            localStorage.setItem(card, enabled);
            // localStorage.setItem(card + '-index', $(this).attr('data-index'))
        });

        hideContextMenu();
        dockRadi();
        alignShelfLabel();
        saveCards();

        $('.shelfLabel').attr('subLbl', '').addClass('show').text(friendlyName + " removed");
        setTimeout(() => {
            $('.shelfLabel').removeClass('show')
        }, 5000);
    }, 250);
    saveCards();
})