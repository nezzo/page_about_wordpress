(function ($, D) {
    $.ajaxSetup({cache: false});
    $(document).ready(function () {
        $(".gallery-item").click(function () {
            var postBG = $(this).find('header').data("bgcolor");
            var $container = $("#zoomer-content");
            if(postBG == '') {
                postBG = 'black';
            }
            $container.css('background-color', postBG);
        });
    });
})(jQuery, myData);