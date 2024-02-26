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

$(document).on("click", '.placeholderCard', function (e) {
    var thisID = $(this).attr('returncard');
    $('.expandableWindow[returncard="' + thisID + '"]').children('.windowOpts').children('.return').click();
})

$('.editMode .card').click(function (e) {
    // if ($('.cards').hasClass('editMode')) {
    $(this).toggleClass('disabled');
    alignShelfLabel();
    // }
});

$('.card').on('mouseover', function (e) {
    if (!$(this).hasClass('placeholderCard')) {
        if ($(this).parent().hasClass('subCards')) {
            $('.shelfLabel').removeClass('show');
            $('.shelfLabel').text($(this).attr('data-friendlyName'));
            if ($(this).attr('data-subLbl')) {
                $('.shelfLabel').attr('subLbl', $(this).attr('data-subLbl'));
            } else {
                $('.shelfLabel').attr('subLbl', '');
            }
        }
        alignShelfLabel();
    }
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

let touchstartX = 0
let touchendX = 0

function checkDirectionWC() {
    if (touchendX < touchstartX - 20) {
        // left swipe
        if ($('.shelf').hasClass('right')) {
            $('#saoC-radio').click()
        } else if ($('.shelf').hasClass('center')) {
            $('#saoL-radio').click()
        }
    } else if (touchendX > touchstartX + 20) {
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