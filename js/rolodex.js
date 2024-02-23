// Rolodex Actions

$('.rolodexOpen').on('click', function (e) {
    i = 0
    if ($('.rolodex').hasClass('visible')) {
        // $('.aboutBtn').removeClass('visible').attr('about', 'PlusUI').attr('ver', $('.siteVer').text());
        $('.rolodex').removeClass('visible');
    } else {
        // $('.aboutBtn').attr('about', 'Card Deck').attr('ver', 'Codename: Rolodex').addClass('visible');
        $('.rolodex').addClass('visible');
        $('.cbs1').scrollLeft(0);

        if ($('.cbs1').children().length == 0) {
            // $('.cbs1').children().first().addClass('hoveredCard')
            $('.roloCardInfo').attr('data-sectName', 'Your card deck is empty')
            $('.roloCardInfo').attr('data-cardDesc', 'Move a card to the deck from the shelf.')
            $('.rolodex').addClass('empty')
        } else {
            $('.cbs1').children().first().addClass('hoveredCard')
            $('.roloCardInfo').attr('data-sectName', $('.hoveredCard').attr('data-friendlyName'))
            $('.roloCardInfo').attr('data-cardDesc', $('.hoveredCard').attr('data-cardDesc'))
            $('.rolodex').removeClass('empty')
        }
    }


    e.stopPropagation();
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
    $('.cbs1').children().eq(i).addClass('hoveredCard')
    $('.roloCardInfo').attr('data-sectName', $('.hoveredCard').attr('data-friendlyName'))
    $('.roloCardInfo').attr('data-cardDesc', $('.hoveredCard').attr('data-cardDesc'))
})

$('.mvCtrl.right').on('click', function () {
    i = i + 1
    if (i == $('.cbs1').children().length) {
        i = 0
        $('.cbs1').scrollLeft(0)
    } else {
        $('.cbs1').scrollLeft($('.cbs1').scrollLeft() + 100);
    }
    // alert(i)
    $('.hoveredCard').removeClass('hoveredCard')
    $('.cbs1').children().eq(i).addClass('hoveredCard')
    $('.roloCardInfo').attr('data-sectName', $('.hoveredCard').attr('data-friendlyName'))
    $('.roloCardInfo').attr('data-cardDesc', $('.hoveredCard').attr('data-cardDesc'))
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
    $(".card").each(function (i, e) {
        var enabled = $(e).attr('data-enabled');
        var card = $(e).attr('id');

        localStorage.setItem(card, enabled);
        // $(this).attr('data-index', $(this).index());
    });
    dockRadi();
    saveCards();

    if ($('.cbs1').children().length == 0) {
        // $('.cbs1').children().first().addClass('hoveredCard')
        $('.roloCardInfo').attr('data-sectName', 'Your card deck is empty')
        $('.roloCardInfo').attr('data-cardDesc', 'Move a card to the deck from the shelf.')
        $('.rolodex').addClass('empty')
    } else {
        $('.cbs1').children().first().addClass('hoveredCard')
        $('.cbs1').scrollLeft(0)
        i = 0;
        $('.roloCardInfo').attr('data-sectName', $('.hoveredCard').attr('data-friendlyName'))
        $('.roloCardInfo').attr('data-cardDesc', $('.hoveredCard').attr('data-cardDesc'))
        $('.rolodex').removeClass('empty')
    }
})