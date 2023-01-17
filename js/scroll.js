jQuery(document).ready(function($) {

    /* ======= Fixed header when scrolled ======= */
    
    $(window).bind('scroll', function() {
         if ($(window).scrollTop() > 154) {
             $('#nav').addClass('navbar-fixed-top');
         }
         else {
             $('#nav').removeClass('navbar-fixed-top');
         }
    });

});
