;(function($){

    var defaults = {
        windowWidth: "800",
        duration: 500,
        sidebarLocation: 'right'
    };

    function MobileMenu (element, options) {
        settings = $.extend({}, defaults, options);
        $this = $(element);

        this.isMobile = false;
        this.init();
    }

    MobileMenu.prototype.init = function() {
         document.body.style.overflow = 'hidden';

        var $burger = this.createBurger();

        this.initDisplay($burger);
        this.resizeWindow($burger);
        this.animateBurger($burger);

        var $sidebar = this.createSidebar();
        var $body = $('<body>');

        this.animate($burger, $sidebar, $body);
    }

    MobileMenu.prototype.toggleMobile = function() {
        this.isMobile = !this.isMobile;
    }

    MobileMenu.prototype.createBurger = function() {
        var $burger = $('<div>').attr('id', 'burger').insertAfter($this);
        var $span = $('<span>').appendTo($burger);

        return $burger;
    }

    MobileMenu.prototype.createSidebar = function() {
        var $sidebar = $('<ul>').attr('id', 'sidebar').insertAfter($this);
        var $sidebarList = $this.children().css({}).clone().appendTo($sidebar);

        $sidebar.css({'position':'absolute', 'list-style':'none',
                        'display':'inline-block', 'padding': 0});
        $sidebar.css(this.positionInit($sidebar));
        $sidebar.hide();
        console.log(-$sidebar.width());
        return $sidebar;
    }

    MobileMenu.prototype.initDisplay = function($burger) {
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
           _this.initDisplay($burger);
        })
    }
    
    MobileMenu.prototype.animateBurger = function($burger) {
        $burger.click(function() {
            $(this).toggleClass('active');
            });
    }

    MobileMenu.prototype.positionInit = function($sidebar) {
        if (settings.sidebarLocation == "left") {
            return {left:-$sidebar.width(), top:0};
        } else {
            return {right:-$sidebar.width(), top:0};  
        }
    }

    MobileMenu.prototype.positionSidebar = function($sidebar) {
        console.log(this.isMobile);
        if (this.isMobile) {
           if (settings.sidebarLocation == "left") {
                return {left:-$sidebar.width(), top:0}
            } else {
                return {right:-$sidebar.width(), top:0}
            }
        } else {
            if (settings.sidebarLocation == "left") { 
                return {left:0, top:0}
            } else {
                return {right:0, top:0}
            }
        }
    }

    MobileMenu.prototype.animate = function($burger, $sidebar, $body) {
        var _this = this;

        $burger.click(function() {
            $sidebar.show();
            $sidebar.animate(_this.positionSidebar($sidebar), settings.duration);
            console.log(_this.positionSidebar($sidebar));
            _this.toggleMobile();
        })   
    }

    $.fn.mobilemenu = function(options) {
        return this.each(function() {
            new MobileMenu(this, options);
        })
    }

})(jQuery);
