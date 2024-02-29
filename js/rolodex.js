// Rolodex Actions

$('.rolodexOpen').on('click', function (e) {
    $('.ic1').attr('avail', 'n');
    $('.ic2').attr('avail', 'n');
    $('.ic3').attr('avail', 'n');

    i = 0
    if ($('.rolodex').hasClass('visible')) {
        $('.rolodex').removeClass('visible');
        $('.card .roloClickBlock').remove();
        cardClickingEnabled = true;
    } else {
        cardClickingEnabled = false;

        $('.expandableWindow .return').click();
        $('.rolodex').addClass('visible');
        $('.cbs1').scrollLeft(0);


        if ($('.cbs1').children().length == 0) {
            // $('.cbs1').children().first().addClass('hoveredCard')
            $('.roloCardInfo').attr('data-sectName', 'Your card deck is empty')
            $('.roloCardInfo').attr('data-cardDesc', 'Move a card to the deck from the shelf.')
            $('.rolodex').addClass('empty')
        } else {
            $('.cbs1').children('.card:visible').first().addClass('hoveredCard')
            $('.roloCardInfo').attr('data-sectName', $('.hoveredCard').attr('data-friendlyName'))
            $('.roloCardInfo').attr('data-cardDesc', $('.hoveredCard').attr('data-cardDesc'))

            if ($('.hoveredCard .cardOptions').children().length !== 0) {
                $('.roloCardOptions').attr('avail', 'This card has ' + $('.hoveredCard .cardOptions').children().length + ' context menu item(s)')
            } else {
                $('.roloCardOptions').attr('avail', 'This card has no context menu items')
            }

            $('.rolodex').removeClass('empty')
        }

        $('.subCards .card').each(function () {
            var clickBlock = $('<div class="roloClickBlock">');
            clickBlock.text($(this).attr('data-friendlyName'));
            $(this).prepend(clickBlock);
        })
    }


    createCategoryBtns();
    $('.allCardsCategory').click();
    e.stopPropagation();
})

function createCategoryBtns() {
    $('.categoryBar').empty();
    const cards = $('.cbs1 .card');
    const uniqueCategories = {};

    cards.each(function () {
        const category = $(this).data('category');
        const catFirstChar = category.charAt(0).toLowerCase();

        if (uniqueCategories[category]) {
            return;
        }

        uniqueCategories[category] = true;
        const categoryDiv = $('<div class="categoryBtn">').attr('data-category', category);
        if (category == 'Display') {
            categoryDiv.append($('<i class="fa-solid fa-display"></i>'))
        } else if (category == 'Information') {
            categoryDiv.append($('<i class="fa-solid fa-info"></i>'))
        } else if (category == 'Web') {
            categoryDiv.append($('<i class="fa-solid fa-globe"></i>'))
        } else if (category == 'Utility') {
            categoryDiv.append($('<i class="fa-solid fa-toolbox"></i>'))
        } else if (category == 'Entertainment') {
            categoryDiv.append($('<i class="fa-solid fa-masks-theater"></i>'))
        } else {
            categoryDiv.append($('<i class="fa-solid fa-' + catFirstChar + '"></i>'))
        }

        $('.categoryBar').append(categoryDiv);
    });

    // Sort catebtns alphabetically
    $(".categoryBtn").sort(function (a, b) {
        var categoryA = $(a).attr("data-category").toLowerCase();
        var categoryB = $(b).attr("data-category").toLowerCase();
        return (categoryA < categoryB) ? -1 : (categoryA > categoryB) ? 1 : 0;
    }).detach().appendTo($('.categoryBar'));

    $('<div class="categoryBtn allCardsCategory selected" data-category="All cards"><i class="fa-solid fa-list-ul"></i></div>').prependTo('.categoryBar')
    $('.allCardsCategory').after('<div class="sep">')
}

$(document).on('click', '.categoryBtn', function () {
    i = 0;
    var thisCategory = $(this).attr('data-category');
    $('.aboutBtn').attr('ver', thisCategory);
    $('.categoryBtn').removeClass('selected')
    $('.cbs1 .card').show();
    if (!$(this).hasClass('allCardsCategory')) {
        $('.cbs1 .card:not([data-category="' + thisCategory + '"])').hide();
    }

    // Sort cards alphabetically
    $(".cbs1 .card:visible").sort(function (a, b) {
        var categoryA = $(a).attr("data-friendlyName").toLowerCase();
        var categoryB = $(b).attr("data-friendlyName").toLowerCase();
        return (categoryA < categoryB) ? -1 : (categoryA > categoryB) ? 1 : 0;
    }).detach().appendTo($('.cbs1'));

    $('.hoveredCard').removeClass('hoveredCard')
    $('.cbs1').scrollLeft(0);
    $('.cbs1').children('.card:visible').first().addClass('hoveredCard');
    $('.roloCardInfo').attr('data-sectName', $('.hoveredCard').attr('data-friendlyName'))
    $('.roloCardInfo').attr('data-cardDesc', $('.hoveredCard').attr('data-cardDesc'))
    $('.hoveredCard').attr('data-parallaxCard') === 'y' ? $('.ic1').attr('avail', 'y') : $('.ic1').attr('avail', 'n');
    $('.hoveredCard').attr('data-resizableCard') === 'y' ? $('.ic2').attr('avail', 'y') : $('.ic2').attr('avail', 'n');
    $('.hoveredCard').attr('data-expandableCard') === 'y' ? $('.ic3').attr('avail', 'y') : $('.ic3').attr('avail', 'n');

    if ($('.hoveredCard .cardOptions').children().length !== 0) {
        $('.roloCardOptions').attr('avail', 'This card has ' + $('.hoveredCard .cardOptions').children().length + ' context menu item(s)')
    } else {
        $('.roloCardOptions').attr('avail', 'This card has no context menu items')
    }

    $(this).addClass('selected')
})

let i = 0
// var scroller = $('.cbs1').children();

$('.mvCtrl.left').on('click', function () {
    i = i - 1
    if (i == -1) {
        i = 0
        $('.cbs1').scrollLeft(0)
    } else {
        $('.cbs1').scrollLeft($('.cbs1').scrollLeft() - 100);
    }
    // alert(i)
    $('.hoveredCard').removeClass('hoveredCard')
    $('.cbs1').children('.card:visible').eq(i).addClass('hoveredCard')

    $('.roloCardInfo').attr('data-sectName', $('.hoveredCard').attr('data-friendlyName'))
    $('.roloCardInfo').attr('data-cardDesc', $('.hoveredCard').attr('data-cardDesc'))
    $('.hoveredCard').attr('data-parallaxCard') === 'y' ? $('.ic1').attr('avail', 'y') : $('.ic1').attr('avail', 'n');
    $('.hoveredCard').attr('data-resizableCard') === 'y' ? $('.ic2').attr('avail', 'y') : $('.ic2').attr('avail', 'n');
    $('.hoveredCard').attr('data-expandableCard') === 'y' ? $('.ic3').attr('avail', 'y') : $('.ic3').attr('avail', 'n');

    if ($('.hoveredCard .cardOptions').children().length !== 0) {
        $('.roloCardOptions').attr('avail', 'This card has ' + $('.hoveredCard .cardOptions').children().length + ' context menu item(s)')
    } else {
        $('.roloCardOptions').attr('avail', 'This card has no context menu items')
    }

})

$('.mvCtrl.right').on('click', function () {
    i = i + 1
    if (i == $('.cbs1').children('.card:visible').length) {
        i = 0
        $('.cbs1').scrollLeft(0)
    } else {
        $('.cbs1').scrollLeft($('.cbs1').scrollLeft() + 100);
    }
    // alert(i)
    $('.hoveredCard').removeClass('hoveredCard')
    $('.cbs1').children('.card:visible').eq(i).addClass('hoveredCard')

    $('.roloCardInfo').attr('data-sectName', $('.hoveredCard').attr('data-friendlyName'))
    $('.roloCardInfo').attr('data-cardDesc', $('.hoveredCard').attr('data-cardDesc'))
    $('.hoveredCard').attr('data-parallaxCard') === 'y' ? $('.ic1').attr('avail', 'y') : $('.ic1').attr('avail', 'n');
    $('.hoveredCard').attr('data-resizableCard') === 'y' ? $('.ic2').attr('avail', 'y') : $('.ic2').attr('avail', 'n');
    $('.hoveredCard').attr('data-expandableCard') === 'y' ? $('.ic3').attr('avail', 'y') : $('.ic3').attr('avail', 'n');

    if ($('.hoveredCard .cardOptions').children().length !== 0) {
        $('.roloCardOptions').attr('avail', 'This card has ' + $('.hoveredCard .cardOptions').children().length + ' context menu item(s)')
    } else {
        $('.roloCardOptions').attr('avail', 'This card has no context menu items')
    }
})

$('.addBtn').on('click', function (e) {
    $('.hoveredCard').attr('data-enabled', 'y');
    $('.hoveredCard').removeClass('deckCard').addClass('removing').appendTo($('.subCards'));
    setTimeout(() => {
        $('.hoveredCard').removeClass('removing').removeClass('.hoveredCard');
    }, 500);
    $(".subCards").sortable("enable");
    $(".subCards").sortable("refresh");
    $(".subCards").sortable("disable");
    dockRadi();
    // saveCards();
    updateCardData();

    if ($('.cbs1').children().length == 0) {
        $('.roloCardInfo').attr('data-sectName', 'Your card deck is empty')
        $('.roloCardInfo').attr('data-cardDesc', 'Move a card to the deck from the shelf.')
        $('.rolodex').addClass('empty')
    } else {
        i = 0;
        $('.cbs1').children('.card:visible').first().addClass('hoveredCard')
        $('.cbs1').scrollLeft(0)
        $('.roloCardInfo').attr('data-sectName', $('.hoveredCard').attr('data-friendlyName'))
        $('.roloCardInfo').attr('data-cardDesc', $('.hoveredCard').attr('data-cardDesc'))
        if ($('.hoveredCard .cardOptions').children().length !== 0) {
            $('.roloCardOptions').attr('avail', 'This card has ' + $('.hoveredCard .cardOptions').children().length + ' context menu item(s)')
        } else {
            $('.roloCardOptions').attr('avail', 'This card has no context menu items')
        }
        $('.rolodex').removeClass('empty')
    }

    createCategoryBtns();
})