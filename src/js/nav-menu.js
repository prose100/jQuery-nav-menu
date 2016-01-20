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
        var $burger = this.createBurger();

        this.animateBurger($burger);
    }

    MobileMenu.prototype.createBurger = function() {
        var $burger = $('<a>').attr('id', 'burger').insertAfter($this);
        var $span = $('<span>').appendTo($burger);

        return $burger;
    }

    MobileMenu.prototype.animateBurger = function($burger) {
        console.log('hello');
        $burger.click(function() {
            $(this).toggleClass('active');
            });
    }

    $.fn.mobilemenu = function(options) {
        return this.each(function() {
            new MobileMenu(this, options);
        })
    }

})(jQuery);