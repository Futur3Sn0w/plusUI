function dockRadi() {
    var lastCurrentCard = $('.subCards').children().last();
    var firstCurrentCard = $('.subCards').children().first();

    if (lastCurrentCard.hasClass('squareCard') || lastCurrentCard.hasClass('rectCard')) {
        $('.subCards').removeClass('right-circle');
    } else if (lastCurrentCard.hasClass('circleCard')) {
        $('.subCards').addClass('right-circle');
    }

    if (firstCurrentCard.hasClass('squareCard') || firstCurrentCard.hasClass('rectCard')) {
        $('.subCards').removeClass('left-circle');
    } else if (firstCurrentCard.hasClass('circleCard')) {
        $('.subCards').addClass('left-circle');
    }
}

$('.card').on('contextmenu', function (e) {
    e.preventDefault();
    if (!$(this).hasClass('deckCard') && !$(this).hasClass('expanded')) {
        cardContextMenu(this);
    }
});

$('.cmi-resize').on('click', function () {
    if ($('.context-selected-card').hasClass('rectCard')) {
        $('.context-selected-card').addClass('squareCard').removeClass('rectCard');
        var card = $('.context-selected-card').attr('id');
        localStorage.setItem(card + '-size', 'squareCard')
    } else if ($('.context-selected-card').hasClass('squareCard')) {
        $('.context-selected-card').addClass('rectCard').removeClass('squareCard');
        var card = $('.context-selected-card').attr('id');
        localStorage.setItem(card + '-size', 'rectCard')
    }
    $('.context-selected-card').removeClass('context-selected-card')
    $('.subCards').removeClass('freeze');
    alignShelfLabel();
});

$('.cmi-expand').on('click', function () {
    $('.context-selected-card').addClass('removing');
    setTimeout(() => {
        $('.context-selected-card').removeClass('removing');
        if ($('.context-selected-card').parent().hasClass('subCards')) {
            var elementToMove = $('.context-selected-card');

            elementToMove.addClass('expanded');

            var expandableWindow = $('<div class="expandableWindow visible">');
            expandableWindow.attr('cardName', elementToMove.attr('data-friendlyName'));
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

        setTheme();
        dockRadi();
        $('.context-selected-card').removeClass('context-selected-card')
        $('.shelfLabel').addClass('show').text("Expanded " + elementToMove.attr('data-friendlyName'));
        $('.subCards').removeClass('freeze');
        alignShelfLabel();
    }, 500);

    setTimeout(() => {
        $('.shelfLabel').removeClass('show')
        alignShelfLabel();
    }, 6000);
})

$('.cmi-editMode').click(function (e) {
    $('.subCards').removeClass('freeze');
    $('.subCards').addClass('editMode');
    $('.subCards').sortable('enable');
    $('.context-selected-card').removeClass('context-selected-card')
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

        $(".subCards").sortable("refresh");
        $('.subCards').removeClass('freeze');
        dockRadi();
        alignShelfLabel();
        saveCards();

        $('.shelfLabel').addClass('show').text(friendlyName + " removed");
        setTimeout(() => {
            $('.shelfLabel').removeClass('show')
        }, 6000);
    }, 1000);
    saveCards();
})

$('.editMode .card').click(function (e) {
    // if ($('.cards').hasClass('editMode')) {
    $(this).toggleClass('disabled');
    alignShelfLabel();
    // }
});

$('.card').on('mouseover', function (e) {
    if ($(this).parent().hasClass('subCards')) {
        $('.shelfLabel').removeClass('show');
        $('.shelfLabel').text($(this).attr('data-friendlyName'));
    }
    alignShelfLabel();
})

$('.card').on('mousedown', function (e) {
    $(this).addClass('md');
})

$('.card').on('mouseup', function (e) {
    $(this).removeClass('md');
})

function alignShelfLabel() {
    const subCards = $('.subCards');
    const shelfLabel = $('.shelfLabel');
    const shelfContainer = $('.shelf');

    // Get the widths of the elements
    const subCardsWidth = subCards.outerWidth();
    const shelfLabelWidth = shelfLabel.outerWidth();

    // Get the positions of the elements within the shelf container
    const subCardsLeft = subCards.offset().left - shelfContainer.offset().left;

    // Calculate the left offset to center the .shelfLabel within the .subCards element
    const leftOffset = subCardsLeft + (subCardsWidth - shelfLabelWidth) / 2;

    // Set the css properties of the .shelfLabel
    shelfLabel.css({
        left: leftOffset + 'px'
    });
}

// Save/recall card order in shelf

function saveCards() {
    var ids = $.map($('.subCards > .card:not(.placeholderCard)'), function (child) {
        return child.id;
    });
    localStorage.setItem('cardList', ids);
}

function recallCards() {
    if (localStorage.getItem('cardList')) {
        var cardList = localStorage.getItem('cardList').split(',');
        $.each(cardList, function (i, card) {
            $('#' + card).appendTo('.subCards').removeClass('deckCard');
        });
    }
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

    if ($(e).hasClass('expandable')) {
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

// Card context menu swipeup gesture (Touch only)

// let touchstartY = 0
// let touchendY = 0

// $('.subCards .card').on('touchstart', function (e) {
//     touchstartY = e.changedTouches[0].screenY
//     $(this).removeClass('fnDown');
// })

// $('.subCards .card').on('touchend', function (e) {
//     touchendY = e.changedTouches[0].screenY
//     $(this).addClass('fnDown');
//     if (touchendY < touchstartY) {
//         // up swipe
//         cardContextMenu(this)
//         $('.fnCard').removeClass('fnCard');
//     }
// })

// Swipe to align shelf

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

document.querySelector('.subCards').addEventListener('touchstart', e => {
    touchstartX = e.changedTouches[0].screenX
})

document.querySelector('.subCards').addEventListener('touchend', e => {
    touchendX = e.changedTouches[0].screenX
    checkDirectionWC()
    e.stopPropagation();
})

// Context menu action for touch

$('.subCards .card').on('dblclick', function (e) {
    if (!$('.subCards').hasClass('editMode') && $(this).parent().hasClass('.subCards')) {
        cardContextMenu(this)
        $('.fnCard').removeClass('fnCard');
    }
})

