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
    }
})

$('.card').on('mousedown', function (e) {
    $(this).addClass('md');
})

$('.card').on('mouseup', function (e) {
    $(this).removeClass('md');
})

// Save/recall card order in shelf

function updateCardData() {
    $(".card:not(.placeholderCard)").each(function () {
        const card = $(this);
        const cardId = card.attr("id");

        if (cardId) {
            const cardData = [];

            cardData.push(card.hasClass("rectCard") ? "rectCard" :
                card.hasClass("squareCard") ? "squareCard" : "circleCard");

            cardData.push(card.data("enabled") === "y" ? "y" : "n");

            const key = `card-${cardId}-data`;
            localStorage.setItem(key, JSON.stringify(cardData));
        }
    });

    var ids = $.map($('.subCards > .card'), function (child) {
        // Check for the placeholderCard class
        if ($(child).hasClass('placeholderCard')) {
            // Remove the '-ph' suffix from the ID
            return child.id.replace(/-ph$/, '');
        } else {
            // Return the original ID for other cards
            return child.id;
        }
    });
    localStorage.setItem('cardList', ids);
}

function restoreCardData() {
    $(".card").each(function () {
        const card = $(this);
        const cardId = card.attr("id");
        const key = `card-${cardId}-data`;

        const cardData = JSON.parse(localStorage.getItem(key));

        if (cardData) {
            card.removeClass("rectCard squareCard circleCard");
            card.addClass(cardData[0]);

            card.attr("data-enabled", cardData[1] === "y" ? "y" : "n");
        }
    });

    $('.card[data-enabled=y]').removeClass('deckCard').detach().appendTo($('.subCards'));
    $('.card[data-enabled=n]').addClass('deckCard').detach().appendTo($('.cbs1'));

    var cardList = localStorage.getItem('cardList').split(',');
    $.each(cardList, function (i, card) {
        $('#' + card).appendTo('.subCards');
    });
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