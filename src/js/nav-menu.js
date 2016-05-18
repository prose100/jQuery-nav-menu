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
        moveInnerWrapper: 0,
        moveInnerWrapper: 0,
        burgerSpanHeight: 5,
        burgerSpanWidth: 30,
        burgerSpacing: 4,
        burgerColor: '#777',
        burgerVisible: false,
        menuOpen: false,
        fixedMenu: true,
        burgerClass: 'burger',
        sidebarClass: 'sidebar',
        innerWrapperClass: 'innerWrapper',
        outerWrapperClass: 'outerWrapper',
        overlayClass: 'overlay',
        activeOverlayClass: 'activeOverlay'
    }

    //dfns:
        //burger: three separated spans
                //z-index above wrappers so that when clicked, the menu does not close
        //sidebar: div that holds nav-menu (see ~line 112)
                //z-index above wrappers so that when clicked, the menu does not close
        //innerWrapper: div that holds burger and sidebar 
                //burger and sidebar are placed absolutely within it relative position
        //outerWrapper: div that holds innerWrapper
                //positioned as fix or relative to fix or make the menu adjustable
        //overlay: div that is equivalent to the body,
                //when clicked on the menu closes  
        //activeOverlay: div that is same as overlay, 
                //except that it appears only when menu is open; not used at the moment;
                //may be incorporated to put a shade over body when menu is open

    function MobileMenu (element, options) {
        settings = $.extend({}, defaults, options);
        $this = $(element);

        this.init();       
    }

    MobileMenu.prototype.init = function() {
        var $burger = this.createBurger();
        var $sidebar = this.createSidebar();
        //Creates outerWrapper and innerWrapper, but just returns innerWrapper
        var $innerWrapper = this.createWrappers($burger, $sidebar);
        var $overlay = this.createOverlay();

        this.positionBurger($burger, $sidebar);
        this.positionSidebar($burger, $sidebar);
        this.positionWrappers($burger, $sidebar, $innerWrapper);
        this.configDisplay($burger, $sidebar);
        this.resizeWindow($burger, $sidebar, $innerWrapper, $overlay);
        
        this.animate = false;
        this.slide($burger, $sidebar, $innerWrapper, $overlay);
    }

    //Checks if in Mobile display mode:
     MobileMenu.prototype.isMobile = function() {
        return ($(window).width()<settings.windowWidth);
    }

    /* ---------------------------------------------
        Burger 
       --------------------------------------------- */
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

        //burger is placed absolutely within the innerWrapper with z-index above wrappers
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

    /* ---------------------------------------------
        Sidebar
       --------------------------------------------- */
    MobileMenu.prototype.createSidebar = function() {

        //Portion of code where html may added to place more content in the menu
        var $sidebar = $('<ul>').attr('class', settings.sidebarClass)
        $this.children().css({}).clone().appendTo($sidebar);

        //sidebar is placed absolutely within the innerWrapper with z-index above wrappers
        $sidebar.css({
            'list-style': 'none',
            'position': 'absolute',
            'z-index': '9999',
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

    /* ---------------------------------------------
        Wrappers
       --------------------------------------------- */
    MobileMenu.prototype.createWrappers = function($burger, $sidebar) {
        var $outerWrapper = $('<div>').attr('class', settings.outerWrapperClass).insertAfter($this);
        var $innerWrapper = $('<div>').attr('class', settings.innerWrapperClass)

        $burger.appendTo($innerWrapper);
        $sidebar.appendTo($innerWrapper);
        $innerWrapper.appendTo($outerWrapper);

        //burger and sidebar are placed absolutely within the innerWrapper
        $innerWrapper.css({
            'position': 'relative',
            'z-index': '9998'
        });

        //outerWrapper position (either fixed or relative) depending on user input
        if (settings.fixedMenu) {
            $outerWrapper.css({
                'position': 'fixed',
                'z-index': '9998'
            })
        } else $outerWrapper.css({
                'position': 'relative',
                'z-index': '9998'
        })
    
        $innerWrapper = $innerWrapper;
        return $innerWrapper;
    }

     MobileMenu.prototype.positionWrappers = function($burger, $sidebar, $innerWrapper) {
        var _sidebarLocation = settings.sidebarLocation;
        if (_sidebarLocation === "right" && settings.menuOpen) {
            $innerWrapper.css({left:($(window).width()-$burger.width()-$sidebar.width()+settings.moveInnerWrapperX), top:settings.moveInnerWrapperY})
            } else if (_sidebarLocation === "right") {
                $innerWrapper.css({left:($(window).width()-$burger.width()+settings.moveInnerWrapperX), top:settings.moveInnerWrapperY})
            } 

        if (_sidebarLocation === "left" && settings.menuOpen) {
            $innerWrapper.css({left:settings.moveInnerWrapperX, top:settings.moveInnerWrapperY});
            } else if (_sidebarLocation === "left") {
                $innerWrapper.css({left:-$sidebar.width()+settings.moveInnerWrapperX, top:settings.moveInnerWrapperY});
            } 
    }

    /* ---------------------------------------------
        Overlay
       --------------------------------------------- */
    MobileMenu.prototype.createOverlay = function() {
        var $overlay = $('<div>');
        $overlay.addClass(settings.overlayClass);
        $('body').prepend($overlay);
        return $overlay;
    }

   /* ---------------------------------------------
        Display
      --------------------------------------------- */
    MobileMenu.prototype.configDisplay = function($burger, $sidebar, $overlay) {
        if (this.isMobile() && settings.menuOpen) {
            $sidebar.show();
            $this.hide();
            } else if (this.isMobile()) {
                $sidebar.show();
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

     /* ---------------------------------------------
        Animate
        --------------------------------------------- */
    MobileMenu.prototype.resizeWindow = function($burger, $sidebar, $innerWrapper, $overlay) {
        var _this = this;

        $(window).resize(function() {
            _this.positionWrappers($burger, $sidebar, $innerWrapper);
            _this.configDisplay($burger, $sidebar, $overlay);            
        });
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
            console.log($overlay);
            $innerWrapper.animate(_this.updateWrapperPosition(settings.menuOpen), _slideDuration, function() {
                $burger.show();
            });
            
            settings.menuOpen = !settings.menuOpen;
            $overlay.removeClass(_activeOverlay);
        });   
    }

    MobileMenu.prototype.updateWrapperPosition = function(isOpen) {
        //Updates inner wrapper position depending on whether menu is open/closed and sidebar is left/right
        if (isOpen) {
            if (settings.sidebarLocation === "left") {
                    return {left: "-=" + settings.slideDistance + "px"}
                } else if (settings.sidebarLocation === "right") {
                    return {left: "+=" + settings.slideDistance + "px"}
                }
        }   else {
                if (settings.sidebarLocation === "left") { 
                    return {left: "+=" + settings.slideDistance + "px"}
                } else if (settings.sidebarLocation === "right") {
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
