;(function($){

    var defaults = {
        windowWidth: 900,
        slideDuration: 500,
        sidebarLocation: 'right',
        slideDistance: 60,
        moveBurgerX: 0,
        moveBurgerY: 0,
        moveSidebarX: 0,
        moveSidebarY: 0,
        burgerClass: 'burger',
        sidebarClass: 'sidebar',
        wrapperClass: 'wrapper'
    }

    function MobileMenu (element, options) {
        settings = $.extend({}, defaults, options);
        $this = $(element);

        this.isMobile = false;
        this.init();
    }

    MobileMenu.prototype.init = function() {
         document.body.style.overflow = 'hidden';

        var $sidebar = this.createSidebar();
        var $burger = this.createBurger();
        var $wrapper = this.createWrapper($burger, $sidebar);

        this.initPositions($burger, $sidebar, $wrapper);
        this.configDisplay($burger);
        this.resizeWindow($burger, $sidebar, $wrapper);
        
        this.slide($burger, $sidebar, $wrapper);
    }

    MobileMenu.prototype.toggleMobile = function() {
        this.isMobile = !this.isMobile;
    }

    MobileMenu.prototype.createBurger = function() {
        var $burger = $('<div>').attr('class', settings.burgerClass)
        var $span = $('<span>').appendTo($burger);
         
        this.absolute($burger);

        return $burger;
    }

    MobileMenu.prototype.createSidebar = function() {
        var $sidebar = $('<ul>').attr('class', settings.sidebarClass)
        var $sidebarList = $this.children().css({}).clone().appendTo($sidebar);

        $sidebar.css({'list-style':'none', 'padding': 0});
        
        this.absolute($sidebar);
    
        return $sidebar;
    }

    MobileMenu.prototype.createWrapper = function($burger, $sidebar) {
        var $wrapper = $('<div>').attr('class', settings.wrapperClass).insertAfter($this);
        
        $burger.appendTo($wrapper);
        $sidebar.appendTo($wrapper);

        this.relative($wrapper);
        $wrapper.addClass('clearfix');

        return $wrapper;
    }

    MobileMenu.prototype.configDisplay = function($burger) {
        if ($(window).width()<settings.windowWidth) {
                $burger.show();
                $this.hide();
            } else {
                $burger.hide();
                $this.show();
            }   
    }

    MobileMenu.prototype.absolute = function(absolute) {
        absolute.css({'position':'absolute'});
    }

    MobileMenu.prototype.relative = function(relative) {
        relative.css({'position':'relative'});
    }

    MobileMenu.prototype.resizeWindow = function($burger, $sidebar, $wrapper) {
        var _this = this;

        $(window).resize(function() {
           _this.initPositions($burger, $sidebar, $wrapper);

           _this.configDisplay($burger);
        })
    }

    MobileMenu.prototype.initPositions = function($burger, $sidebar, $wrapper) {
         if (settings.sidebarLocation == "left") {
            $burger.css({left:$sidebar.width()+settings.moveBurgerX, top:settings.moveBurgerY});
            $sidebar.css({left:settings.moveSidebarX, top:settings.moveSidebarY});
            $wrapper.css({left:-$sidebar.width()-8, top:0});
        } else if (settings.sidebarLocation == "right") {
            $burger.css({left:settings.moveBurgerX, top:settings.moveBurgerY});
            $sidebar.css({left:$burger.width()+settings.moveSidebarX, top:settings.moveSidebarY});
            $wrapper.css({left:($(window).width()-$burger.width())+"px", top:0})
        }
    }

    MobileMenu.prototype.updateWrapperPosition = function() {
        if (this.isMobile) {
            if (settings.sidebarLocation == "left") {
                return {left: "-=" + settings.slideDistance + "px"}
            } else if (settings.sidebarLocation == "right") {
                return {left: "+=" + settings.slideDistance + "px"}
            }
        } else {
            if (settings.sidebarLocation == "left") { 
                return {left: "+=" + settings.slideDistance + "px"}
            } else if (settings.sidebarLocation == "right") {
                return {left: "-=" + settings.slideDistance + "px"}
            }
        }
    }

    MobileMenu.prototype.slide = function($burger, $sidebar, $wrapper) {
        var _this = this;

        $burger.click(function() {
            $sidebar.show();
            $wrapper.animate(_this.updateWrapperPosition(), settings.slideDuration);
            _this.toggleMobile();
        })   
    }

    $.fn.mobilemenu = function(options) {
        return this.each(function() {
            new MobileMenu(this, options);
        })
    }

})(jQuery);
