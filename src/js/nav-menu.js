;(function($){

    var defaults = {
        windowWidth: "900",
        duration: 500,
        sidebarLocation: 'left',
        slideDistance: "60"
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
        var $burger = this.createBurger($sidebar);
        var $wrapper = this.createWrapper($burger, $sidebar);

        this.initPositions($burger, $sidebar, $wrapper);
        this.configDisplay($burger, $sidebar);
        this.resizeWindow($burger, $sidebar, $wrapper);
        
        this.animate($burger, $sidebar, $wrapper);
    }

    MobileMenu.prototype.toggleMobile = function() {
        this.isMobile = !this.isMobile;
    }

    MobileMenu.prototype.createBurger = function($sidebar) {
        var $burger = $('<div>').attr('id', 'burger')
        var $span = $('<span>').appendTo($burger);
         
        this.absolute($burger);

        return $burger;
    }

    MobileMenu.prototype.createSidebar = function($burger) {
        var $sidebar = $('<ul>').attr('id', 'sidebar')
        var $sidebarList = $this.children().css({}).clone().appendTo($sidebar);

        $sidebar.css({'list-style':'none', 'padding': 0});
        
        this.absolute($sidebar);
    
        return $sidebar;
    }

    MobileMenu.prototype.createWrapper = function($burger, $sidebar) {
        var $wrapper = $('<div>').attr('id', 'wrapper').insertAfter($this);
        
        $burger.appendTo($wrapper);
        $sidebar.appendTo($wrapper);

        this.relative($wrapper);
        $wrapper.addClass('clearfix');

        return $wrapper;
    }

    MobileMenu.prototype.configDisplay = function($burger, $sidebar) {
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

           _this.configDisplay($burger, $sidebar);
        })
    }

    MobileMenu.prototype.initPositions = function($burger, $sidebar, $wrapper) {
         if (settings.sidebarLocation == "left") {
            $burger.css({left:$sidebar.width(), top:0});
            $sidebar.css({left:0, top:0});
            $wrapper.css({left:-$sidebar.width()-8, top:0});
        } else if (settings.sidebarLocation == "right") {
            $burger.css({left:0, top:0});
            $sidebar.css({left:$burger.width(), top:0});
            $wrapper.css({left:($(window).width()-$burger.width())+"px", top:0})
        }
    }

    MobileMenu.prototype.nextPositionSidebar = function() {
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

    MobileMenu.prototype.animate = function($burger, $sidebar, $wrapper) {
        var _this = this;

        $burger.click(function() {
            $sidebar.show();
            $wrapper.animate(_this.nextPositionSidebar(), settings.duration);
            _this.toggleMobile();
        })   
    }

    $.fn.mobilemenu = function(options) {
        return this.each(function() {
            new MobileMenu(this, options);
        })
    }

})(jQuery);
