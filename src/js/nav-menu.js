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
        burgerColor: '#777',
        burgerVisible: false,
        burgerClass: 'burger',
        menuOpen: false,
        sidebarClass: 'sidebar',
        innerWrapperClass: 'innerWrapper',
        outerWrapperClass: 'outerWrapper',
        overlayClass: 'overlay',
        activeOverlayClass: 'activeOverlay'
    }

    function MobileMenu (element, options) {
        settings = $.extend({}, defaults, options);
        $this = $(element);

        this.init();       
    }

    MobileMenu.prototype.init = function() {
        var $burger = this.createBurger();
        var $sidebar = this.createSidebar();
        var $innerWrapper = this.createWrappers($burger, $sidebar);
        var $overlay = this.createOverlay();

        this.positionBurger($burger, $sidebar);
        this.positionSidebar($burger, $sidebar);
        this.position($burger, $sidebar, $innerWrapper);
        this.configDisplay($burger, $sidebar);
        this.resizeWindow($burger, $sidebar, $innerWrapper, $overlay);
        
        this.animate = false;
        this.slide($burger, $sidebar, $innerWrapper, $overlay);
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

    MobileMenu.prototype.positionBurger = function($burger, $sidebar) {
        if (settings.sidebarLocation === "right") {
            $burger.css({left: settings.moveBurgerX, top: settings.moveBurgerY});
            } else {
                $burger.css({left: $sidebar.width()+settings.moveBurgerX, top: settings.moveBurgerY});
            }
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

    MobileMenu.prototype.positionSidebar = function($burger, $sidebar) {
        if (settings.sidebarLocation === "right") {
            $sidebar.css({left: $burger.width()+settings.moveSidebarX, top: settings.moveSidebarY});
        } else {
            $sidebar.css({left: settings.moveSidebarX, top: settings.moveSidebarY}); 
        }
    }

    MobileMenu.prototype.createWrappers = function($burger, $sidebar) {
        var $outerWrapper = $('<div>').attr('class', settings.outerWrapperClass).insertAfter($this);
        var $innerWrapper = $('<div>').attr('class', settings.innerWrapperClass)

        $burger.appendTo($innerWrapper);
        $sidebar.appendTo($innerWrapper);
        $innerWrapper.appendTo($outerWrapper);

        $innerWrapper.css({
            'position': 'relative'
        });

        $outerWrapper.css({
            'position': 'fixed'
        })

        return $innerWrapper;
    }

    MobileMenu.prototype.createOverlay = function() {
        var $overlay = $('<div>');
        $overlay.addClass(settings.overlayClass);
        $('body').prepend($overlay);
        return $overlay;
    }

    MobileMenu.prototype.configDisplay = function($burger, $sidebar, $overlay) {
        if (this.isMobile() && settings.menuOpen) {
            $sidebar.show();
            $this.hide();
            } else if (this.isMobile()) {
                $sidebar.hide();
                $this.hide();
                $burger.show();
            } else if (settings.menuOpen) {
                $sidebar.hide();
                $this.show();
                $burger.hide();
                settings.menuOpen = false;
                $overlay.removeClass(settings.activeOverlayClass);
            } else {
                $sidebar.hide();
                $this.show();
                $burger.hide();
            }
    }

    MobileMenu.prototype.resizeWindow = function($burger, $sidebar, $innerWrapper, $overlay) {
        var _this = this;

        $(window).resize(function() {
            _this.position($burger, $sidebar, $innerWrapper);
            _this.configDisplay($burger, $sidebar, $overlay);            
        });
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
    }

    MobileMenu.prototype.position = function($burger, $sidebar, $innerWrapper) {
        var _sidebarLocation = settings.sidebarLocation;
        if (_sidebarLocation === "right" && settings.menuOpen) {
            $innerWrapper.css({left:($(window).width()-$burger.width()-$sidebar.width()), top:0})
            } else if (_sidebarLocation === "right") {
                $innerWrapper.css({left:($(window).width()-$burger.width()), top:0})
            } 

        if (_sidebarLocation === "left" && settings.menuOpen) {
            $innerWrapper.css({left:0, top:0});
            } else if (_sidebarLocation === "left") {
                $innerWrapper.css({left:-$sidebar.width(), top:0});
            } 
    }

    MobileMenu.prototype.slide = function($burger, $sidebar, $innerWrapper, $overlay) {
        var _this = this;
        var _slideDuration = settings.slideDuration;
        var _burgerVisible = settings.burgerVisible;
        var _activeOverlay = settings.activeOverlayClass;

        $burger.click(function() {
            $sidebar.show();

            $innerWrapper.animate(_this.updateWrapperPosition(settings.menuOpen), _slideDuration);
            settings.menuOpen = !settings.menuOpen;  
            
            if (settings.menuOpen) {
                $overlay.addClass(_activeOverlay);
            } else {
                $overlay.removeClass(_activeOverlay);
            }

            if (!_burgerVisible) {
                $burger.hide();
            }
        });

        $overlay.click(function() {
            $innerWrapper.animate(_this.updateWrapperPosition(settings.menuOpen), _slideDuration, function() {
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
