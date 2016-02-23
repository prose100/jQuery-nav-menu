;(function($){

    var defaults = {
        windowWidth: 600,
        slideDuration: 500,
        sidebarLocation: 'right',
        slideDistance: 70,
        moveBurgerX: 0,
        moveBurgerY: 0,
        moveSidebarX: 0,
        moveSidebarY: 0,
        burgerSpanHeight: 5,
        burgerSpanWidth: 30,
        burgerSpacing: 4,
        burgerColor: "#777",
        burgerClass: 'burger',
        sidebarClass: 'sidebar',
        wrapperClass: 'wrapper'
    }

    function MobileMenu (element, options) {
        settings = $.extend({}, defaults, options);
        $this = $(element);

        this.isMenuDisplayed = false;
        this.init();
    }

    MobileMenu.prototype.init = function() {

        var $sidebar = this.createSidebar();
        var $burger = this.createBurger();
        var $wrapper = this.createWrapper($burger, $sidebar);

        this.initPositions($burger, $sidebar, $wrapper);
        this.configDisplay($burger);
        this.resizeWindow($burger, $sidebar, $wrapper);
        
        this.slide($burger, $sidebar, $wrapper);
    }

    MobileMenu.prototype.toggleMenuDisplay = function() {
        this.isMenuDisplayed = !this.isMenuDisplayed;
    }

    MobileMenu.prototype.createBurger = function() {
        var $burger = $('<div>').attr('class', settings.burgerClass)
        $burger.css({'cursor':'pointer'});

        var $spanMiddle = this.createSpan();
        $spanMiddle.appendTo($burger);

        $spanMiddle.css({'margin-top': settings.burgerSpacing, 'margin-bottom': settings.burgerSpacing});

        var $spanTop = this.createSpan();
        $spanTop.insertBefore($spanMiddle);
        var $spanBottom = this.createSpan();
        $spanBottom.insertAfter($spanMiddle);

        this.absolute($burger);

        return $burger;
    }

    MobileMenu.prototype.createSpan = function() {
        return $('<span>').css(this.spanProperties());
    }

    MobileMenu.prototype.spanProperties = function() {
        return {'height': settings.burgerSpanHeight,
                'width': settings.burgerSpanWidth,
                'background': settings.burgerColor,
                'display': 'block'}
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

    MobileMenu.prototype.getScrollBarWidth = function() {
        var parent, child, width;

          if (width===undefined) {
            parent = $('<div style="width:50px;height:50px;overflow:auto"><div/></div>').appendTo('body');
            child=parent.children();
            width=child.innerWidth()-child.height(99).innerWidth()-8;
            parent.remove();
          }
        return width;
    };

    MobileMenu.prototype.initPositions = function($burger, $sidebar, $wrapper) {
         if (settings.sidebarLocation === "left") {
            $burger.css({left:$sidebar.width()+settings.moveBurgerX, top:settings.moveBurgerY});
            $sidebar.css({left:settings.moveSidebarX, top:settings.moveSidebarY});
            console.log($(window).width());
            console.log($burger.width());
             console.log($sidebar.width());
            console.log(this.getScrollBarWidth());
            $wrapper.css({left:-$sidebar.width()-this.getScrollBarWidth(), top:0});
        } else if (settings.sidebarLocation === "right") {
            $burger.css({left:settings.moveBurgerX, top:settings.moveBurgerY});
            $sidebar.css({left:$burger.width()+settings.moveSidebarX, top:settings.moveSidebarY});
            console.log($(window).width());
            console.log($burger.width());
            console.log(this.getScrollBarWidth());
            $wrapper.css({left:($(window).width()-$burger.width()-this.getScrollBarWidth()), top:0})
        }
    }

    MobileMenu.prototype.updateWrapperPosition = function() {
        if (this.isMenuDisplayed) {
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
            _this.toggleMenuDisplay();
        })   
    }

    $.fn.mobilemenu = function(options) {
        return this.each(function() {
            new MobileMenu(this, options);
        })
    }

})(jQuery);
