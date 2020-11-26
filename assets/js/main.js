$(document).ready(() => {
    updateLinkActivity(window.location.pathname)
    
    $('#want-long-bio').click(function () {
        let isHidden = $('#long-about').hasClass('hide')
        if (isHidden) {
            $('#long-about').removeClass('hide');
            $('#want-long-bio').text("Want less bio?")
        } else {
            $('#long-about').addClass('hide');
            $('#want-long-bio').text("Want more bio?")
        }
    });
});



/**
 * links should have the active class in two situations:
 * 1) link href matches pathname
 * 2) when a link is clicked
 * 
 * All other links should not have the active class
 */
const updateLinkActivity = path => {
    $('li.nav-item a').each((i, el) => {
        if ($(el).attr('href') === path) {
            $(el).addClass('active');
        } else {
            $(el).removeClass('active');
        }

        $(el).click(() => {
            $('li.nav-item a.active').removeClass('active');
            $(el).addClass('active');
        })
    });   
}
