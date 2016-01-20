;(function($){

    var defaults = {

    };

    function MobileMenu (element, options) {
        settings = $.extend({}, defaults, options);
        $this = $(element);

        this.init();
    }

    MobileMenu.prototype.init = function() {

    }

    $.fn.mobilemenu = function(options) {
        return this.each(function() {
            new MobileMenu(this, options);
        })
    }

})(jQuery);