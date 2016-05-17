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
        burgerVisible: false,
        burgerClass: 'burger',
        menuOpen: false,
        sidebarClass: 'sidebar',
        wrapperClass: 'wrapper',
        overlayClass: 'overlay',
        activeOverlayClass: 'activeOverlay'
    }

    function MobileMenu (element, options) {
        settings = $.extend({}, defaults, options);
        $this = $(element);

        this.init();       
    }

    MobileMenu.prototype.init = function() {
        var $sidebar = this.createSidebar();
        var $burger = this.createBurger();
        var $wrapper = this.createWrapper($burger, $sidebar);
        var $overlay = this.createOverlay();

        this.position($burger, $sidebar, $wrapper);
        this.configDisplay($burger, $sidebar);
        this.resizeWindow($burger, $sidebar, $wrapper);
        
        this.animate = false;
        this.slide($burger, $sidebar, $wrapper, $overlay);
    }

     MobileMenu.prototype.isMobile = function() {
        return ($(window).width()<settings.windowWidth);
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

        $burger.css({
            'position': 'absolute',
            'z-index': '9999'
        })

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

        $sidebar.css({
            'position': 'absolute',
            'z-index': '9999'
        })
    
        return $sidebar;
    }

    MobileMenu.prototype.createWrapper = function($burger, $sidebar) {
        var $wrapper = $('<div>').attr('class', settings.wrapperClass).insertAfter($this);
        
        $burger.appendTo($wrapper);
        $sidebar.appendTo($wrapper);

        $wrapper.css({
            'position': 'relative'
        });

        return $wrapper;
    }

    MobileMenu.prototype.createOverlay = function() {
        var $overlay = $('<div>');
        $overlay.addClass(settings.overlayClass);
        $('body').prepend($overlay);
        return $overlay;
    }

    MobileMenu.prototype.configDisplay = function($burger, $sidebar) {
        if (this.isMobile()) {
                $burger.show();
                $this.hide();
            } else {
                $sidebar.hide();
                $burger.hide();
                $this.show();
            }   
    }

    MobileMenu.prototype.resizeWindow = function($burger, $sidebar, $wrapper) {
        var _this = this;
        var _sidebarLocation = settings.sidebarLocation;
        var _windowWidth = settings.windowWidth;
        var _moveBurgerX = settings.moveBurgerX;
        var _moveBurgerY = settings.moveBurgerY;
        var _moveSidebarX = settings.moveSidebarX;
        var _moveSidebarY = settings.moveSidebarY;
        var $_this = $this;

        $(window).resize(function() {
           _this.position($burger, $sidebar, $wrapper);
           _this.configDisplay($burger, $sidebar);
          
            // function position($burger, $sidebar, $wrapper) {
            //      if (_sidebarLocation === "left") {
            //         $burger.css({left:$sidebar.width()+_moveBurgerX, top:_moveBurgerY});
            //         $sidebar.css({left:_moveSidebarX, top:_moveSidebarY});
            //         $wrapper.css({left:-$sidebar.width()-_this.getScrollBarWidth(), top:0});
            //     } else if (_sidebarLocation === "right") {
            //         $burger.css({left:_moveBurgerX, top:_moveBurgerY});
            //         $sidebar.css({left:$burger.width()+_moveSidebarX, top:_moveSidebarY});
            //         $wrapper.css({left:($(window).width()-$burger.width()-_this.getScrollBarWidth()), top:0})
            //     }
            // }                   
        });
    }

    MobileMenu.prototype.position = function($burger, $sidebar, $wrapper) {
        // var _sidebarLocation = settings.sidebarLocation;
         if (settings.sidebarLocation === "left") {
            $burger.css({left:$sidebar.width()+settings.moveBurgerX, top:settings.moveBurgerY});
            $sidebar.css({left:settings.moveSidebarX, top:settings.moveSidebarY});
            $wrapper.css({left:-$sidebar.width()-this.getScrollBarWidth(), top:0});
        } else if (settings.sidebarLocation === "right") {
            $burger.css({left:settings.moveBurgerX, top:settings.moveBurgerY});
            $sidebar.css({left:$burger.width()+settings.moveSidebarX, top:settings.moveSidebarY});
            $wrapper.css({left:($(window).width()-$burger.width()-this.getScrollBarWidth()), top:0})
        }
    }
    

    MobileMenu.prototype.getScrollBarWidth = function() {
        var parent, child, width;

          if (width===undefined) {
            parent = $('<div style="width:50px;height:50px;overflow:auto"><div/></div>').appendTo('body');
            child=parent.children();
            width=child.innerWidth()-child.height(99).innerWidth()-1;
            parent.remove();
          }
        return width;
    };

    MobileMenu.prototype.position = function($burger, $sidebar, $wrapper) {
        var _sidebarLocation = settings.sidebarLocation;
         if (_sidebarLocation === "left") {
            $burger.css({left:$sidebar.width()+settings.moveBurgerX, top:settings.moveBurgerY});
            $sidebar.css({left:settings.moveSidebarX, top:settings.moveSidebarY});
            $wrapper.css({left:-$sidebar.width()-this.getScrollBarWidth(), top:0});
        } else if (_sidebarLocation === "right") {
            $burger.css({left:settings.moveBurgerX, top:settings.moveBurgerY});
            $sidebar.css({left:$burger.width()+settings.moveSidebarX, top:settings.moveSidebarY});
            $wrapper.css({left:($(window).width()-$burger.width()-this.getScrollBarWidth()), top:0})
        }
    }

    MobileMenu.prototype.slide = function($burger, $sidebar, $wrapper, $overlay) {
        var _this = this;
        var _slideDuration = settings.slideDuration;
        var _burgerVisible = settings.burgerVisible;
        var _activeOverlay = settings.activeOverlayClass;

        $burger.click(function() {
            $sidebar.show();

            $wrapper.animate(_this.updateWrapperPosition(settings.menuOpen), _slideDuration);
            settings.menuOpen = !settings.menuOpen;  
            $overlay.addClass(_activeOverlay);

            if (!_burgerVisible) {
                $burger.hide();
            }
        });

        $overlay.click(function() {
            $wrapper.animate(_this.updateWrapperPosition(settings.menuOpen), _slideDuration, function() {
                $burger.show();
            });
            
            settings.menuOpen = !settings.menuOpen;
            $overlay.removeClass(_activeOverlay);
        });   
    }

    MobileMenu.prototype.updateWrapperPosition = function(isOpen) {
        if (isOpen) {
            if (settings.sidebarLocation === "left") {
                    console.log('hi1');
                    return {left: "-=" + settings.slideDistance + "px"}
                } else if (settings.sidebarLocation === "right") {
                    console.log('hi2');
                    return {left: "+=" + settings.slideDistance + "px"}
                }
            } else {
                if (settings.sidebarLocation === "left") { 
                    console.log('hi3');
                    return {left: "+=" + settings.slideDistance + "px"}
                } else if (settings.sidebarLocation === "right") {
                    console.log('hi4');
                    return {left: "-=" + settings.slideDistance + "px"}
                }
            }                   
    }          

    $.fn.mobilemenu = function(options) {
        return this.each(function() {
            new MobileMenu(this, options);
        })
    }

})(jQuery);
