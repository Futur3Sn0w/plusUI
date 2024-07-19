// Rolodex Actions

$('.rolodexOpen').on('click', function (e) {
    if ($('.rolodex').hasClass('visible')) {
        $('.rolodex').removeClass('visible');
        setTimeout(() => {
            $('.cbs1 .card').appendTo($('.cbSect'));
            $('.card-container').remove();
        }, 250);
        cardClickingEnabled = true;
    } else {
        cardClickingEnabled = false;

        $('.expandableWindow .return').click();
        $('.rolodex').addClass('visible');

        if ($('.cbs1').children().length == 0) {
            $('.rolodex').addClass('empty')
        } else {
            if ($('.card-container').length == 0) {
                $('.cbSect .card').each(function () {
                    var cardContainer = $('<div>').addClass('card-container').addClass('surface').attr('id', $(this).attr('id') + "--cont");

                    var friendlyName = $('<div class="cardName">').text($(this).attr('data-friendlyName'));
                    var cardDesc = $('<div class="cardDesc">').text($(this).attr('data-cardDesc'));
                    var addBtn = $('<div class="addBtn">').text('Add');

                    var iconContainer = $('<div class="infoChips">');

                    var icon1 = $('<i>').addClass('infoChip fa-solid fa-layer-group').attr('infochip', 'Parallax');
                    var icon2 = $('<i>').addClass('infoChip fa-solid fa-up-right-and-down-left-from-center').attr('infochip', 'Resizable');
                    var icon3 = $('<i>').addClass('infoChip fa-solid fa-clone').attr('infochip', 'Expandable');

                    icon1.attr('data-avail', $(this).attr('data-parallaxCard') || 'n'); // Default to 'n' if not set
                    icon2.attr('data-avail', $(this).attr('data-resizableCard') || 'n');
                    icon3.attr('data-avail', $(this).attr('data-expandableCard') || 'n');

                    iconContainer.append(icon1, icon2, icon3);

                    if ($(this).children('.cardOptions').length > 0) {
                        cardDesc.attr('options', ' - ' + $(this).children('.cardOptions').length + ' option(s)')
                    } else {
                        cardDesc.attr('options', ' - No options')
                    }

                    cardContainer.append(friendlyName, cardDesc, addBtn, iconContainer);

                    $('.cbs1').append(cardContainer);

                    $(this).appendTo($('#' + $(this).attr('id') + "--cont"));
                });
            }

            $('.rolodex').removeClass('empty')
        }
    }

    createCategoryBtns();
    $('.allCardsCategory').click();
    e.stopPropagation();
})

function createCategoryBtns() {
    $('.categoryBar').empty();
    const cards = $('.cbs1 .card-container .card');
    const uniqueCategories = {};

    cards.each(function () {
        const categories = $(this).data('category').split(',');  // Get comma-separated categories

        categories.forEach(function (category) {
            const catFirstChar = category.charAt(0).toLowerCase();

            if (uniqueCategories[category]) {
                return;
            }

            uniqueCategories[category] = true;
            const categoryDiv = $('<div class="categoryBtn">').attr('data-category', category);

            // ... (Rest of the code for creating categoryDiv and sorting)
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
            } else if (category == 'Shortcuts') {
                categoryDiv.append($('<i class="fa-solid fa-share"></i>'))
            } else {
                categoryDiv.append($('<i class="fa-solid fa-' + catFirstChar + '"></i>'))
            }

            $('.categoryBar').append(categoryDiv);
        });
    });

    // Sort catebtns alphabetically
    $(".categoryBtn").sort(function (a, b) {
        var categoryA = $(a).attr("data-category").toLowerCase();
        var categoryB = $(b).attr("data-category").toLowerCase();
        return (categoryA < categoryB) ? -1 : (categoryA > categoryB) ? 1 : 0;
    }).detach().appendTo($('.categoryBar'));

    $('<div class="categoryBtn allCardsCategory selected" data-category="Available cards"><i class="fa-solid fa-list-ul"></i></div>').prependTo('.categoryBar')
    $('.allCardsCategory').after('<div class="sep">')
}

// $(document).on('click', '.categoryBtn', function () {
//     i = 0;
//     var thisCategory = $(this).attr('data-category');
//     $('.contextBadge').attr('ver', thisCategory);
//     $('.categoryBtn').removeClass('selected')
//     $('.cbs1 .card-container').show();
//     if (!$(this).hasClass('allCardsCategory')) {
//         $('.cbs1 .card:not([data-category="' + thisCategory + '"])').parent().hide();
//     }

//     // Sort cards alphabetically
//     $(".cbs1 .card-container:visible").sort(function (a, b) {
//     }).detach().appendTo($('.cbs1'));


//     $(this).addClass('selected')
// })

$(document).on('click', '.categoryBtn', function () {
    i = 0;
    var categories = $(this).attr('data-category').split(',');

    $('.contextBadge').attr('ver', categories.join(',')); // Update ver with comma-separated categories
    $('.categoryBtn').removeClass('selected');
    $('.cbs1 .card-container').show();

    if (!$(this).hasClass('allCardsCategory')) {
        // Hide cards that don't match any of the clicked categories
        $('.cbs1 .card').each(function () {
            var cardCategories = $(this).attr('data-category').split(',');
            var match = false;
            for (var i = 0; i < categories.length; i++) {
                if ($.inArray(categories[i], cardCategories) !== -1) {
                    match = true;
                    break;
                }
            }
            if (!match) {
                $(this).parent().hide();
            }
        });
    }

    // Sort visible card containers alphabetically
    $(".cbs1 .card-container:visible").sort(function (a, b) {
        var categoryA = $(a).children('.card').attr("data-friendlyName").toLowerCase();
        var categoryB = $(b).children('.card').attr("data-friendlyName").toLowerCase();
        return (categoryA < categoryB) ? -1 : (categoryA > categoryB) ? 1 : 0;
    }).detach().appendTo($('.cbs1'));

    $(this).addClass('selected');
});


$(document).on('click', '.addBtn', function (e) {
    $(this).parent().children('.card').removeClass('deckCard').addClass('removing').appendTo($('.subCards'));
    setTimeout(() => {
        $(this).parent().remove();
        $('.card.removing').removeClass('removing');
    }, 500);
    $(".subCards").sortable("enable");
    $(".subCards").sortable("refresh");
    $(".subCards").sortable("disable");
    dockRadi();
    updateCardData();

    if ($('.cbs1').children().length == 0) {
        $('.rolodex').addClass('empty')
    } else {
        $('.rolodex').removeClass('empty')
    }

    createCategoryBtns();
})

$(document).on('mouseover', '.infoChip', function () {
    $(this).parent().parent().children('.cardDesc').attr('infochip', $(this).attr('infochip'));
})