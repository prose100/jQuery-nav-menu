;(function($){

    var defaults = {
        windowWidth: "800"
    };

    function MobileMenu (element, options) {
        settings = $.extend({}, defaults, options);
        $this = $(element);

        this.init();
    }

    MobileMenu.prototype.init = function() {
        var $burger = this.createBurger();

        console.log($burger);
        this.display($burger);
        this.resizeWindow($burger);
        this.animateBurger($burger);
    }

    MobileMenu.prototype.createBurger = function() {
        var $burger = $('<a>').attr('id', 'burger').insertAfter($this);
        var $span = $('<span>').appendTo($burger);

        return $burger;
    }

    MobileMenu.prototype.display = function($burger) {
        if ($(window).width()<settings.windowWidth) {
                $burger.show();
                $this.hide();
            } else {
                $burger.hide();
                $this.show();
            }   
    }

    MobileMenu.prototype.resizeWindow= function($burger) {
        var _this = this;

        $(window).resize(function() {
           _this.display($burger);
        })
    }
    
    MobileMenu.prototype.animateBurger = function($burger) {
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