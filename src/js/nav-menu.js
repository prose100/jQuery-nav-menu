;(function($){

    var defaults = {

    };

    function MobileMenu (element, options) {
        settings = $.extend({}, defaults, options);
        $this = $(element);

        this.init();
        console.log('hi');
    }

    MobileMenu.prototype.init = function() {
        this.createBurger();
    }

    MobileMenu.prototype.createBurger = function() {
        var $navToggle = $('<a>').attr('id', 'navToggle').insertAfter($this);
        var $span = $('<span>').appendTo($navToggle);
    }

    $.fn.mobilemenu = function(options) {
        return this.each(function() {
            new MobileMenu(this, options);
        })
    }

})(jQuery);