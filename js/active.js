$(function () {
    setNavigation();
});

function setNavigation() {
    var path = window.location.pathname;
    path = decodeURIComponent(path);

    console.log(path);

    $("#nav li a").each(function () {
        var href = $(this).attr('href').replace("index.html", "");
        if (path === href) {
            $(this).addClass('current');
            console.log(href);
        }
    });
}