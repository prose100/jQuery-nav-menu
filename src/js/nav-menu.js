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
        fixedSidebar: true,
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
        //Initial OpenMenuStatus; starts Not(false) Open
        var openMenuStatus = false;
        this.setOpenMenuStatus(openMenuStatus);

        //Initial FixedSidebarStatus; starts Not(false) Fixed
        var fixedSidebarStatus = false;
        this.setFixedSidebarStatus(fixedSidebarStatus);

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
        
        this.animate($burger, $sidebar, $innerWrapper, $overlay);
    }

    /* ---------------------------------------------
        Getter and Setter for OpenMenuStatus
       --------------------------------------------- */
    MobileMenu.prototype.getOpenMenuStatus = function() {
        return this.openMenuStatus;
    }

    MobileMenu.prototype.setOpenMenuStatus = function(openMenuStatus) {
        this.openMenuStatus = openMenuStatus;
    }

    /* ---------------------------------------------
        Getter and Setter for FixedSidebarStatus
       --------------------------------------------- */
    MobileMenu.prototype.setAbsoluteSidebar = function($sidebar) {
        $sidebar.css({'position': 'absolute'})
    }

    MobileMenu.prototype.setFixedSidebar = function($sidebar) {
        $sidebar.css({'position': 'fixed'})
    }    

    MobileMenu.prototype.getFixedSidebarStatus = function() {
        return this.fixedSidebarStatus;
    }

    MobileMenu.prototype.setFixedSidebarStatus = function(fixedSidebarStatus) {
        this.fixedSidebarStatus = fixedSidebarStatus;
    }

    /* ---------------------------------------------
        Checks if window is in Mobile Mode
       --------------------------------------------- */
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
            $burger.css({right: $sidebar.width()+settings.moveBurgerX, top: settings.moveBurgerY});
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
            $sidebar.css({right: settings.moveSidebarX, top: settings.moveSidebarY}); 
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
    
        $innerWrapper = $innerWrapper;
        return $innerWrapper;
    }

     MobileMenu.prototype.positionWrappers = function($burger, $sidebar, $innerWrapper) {
        var _sidebarLocation = settings.sidebarLocation;

        var browserPositionY =  window.pageYOffset || document.documentElement.scrollTop;

        if (_sidebarLocation === "right" && this.getOpenMenuStatus()) {
            $innerWrapper.css({right:settings.moveInnerWrapperX, top: browserPositionY + settings.moveInnerWrapperY});

            } else if (_sidebarLocation === "right") {
                $innerWrapper.css({right:-$sidebar.width()+settings.moveInnerWrapperX, top: browserPositionY + settings.moveInnerWrapperY});
            } 

        if (_sidebarLocation === "left" && this.getOpenMenuStatus()) {
            $innerWrapper.css({left:settings.moveInnerWrapperX, top: browserPositionY + settings.moveInnerWrapperY});
            
            } else if (_sidebarLocation === "left") {
                $innerWrapper.css({left:-$sidebar.width()+settings.moveInnerWrapperX, top: browserPositionY + settings.moveInnerWrapperY});
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
        if (this.isMobile() && this.getOpenMenuStatus()) {
            $sidebar.show();
            $this.hide();
            } else if (this.isMobile()) {
                $sidebar.hide(); 
                $this.hide();
                //sidebar is no longer fixed when the menu is closed
                this.setAbsoluteSidebar($sidebar);
                $burger.show();
            } else if (this.getOpenMenuStatus()) {
                $sidebar.hide();
                $this.show();
                $burger.hide();
                this.setOpenMenuStatus(false);
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
            _this.configDisplay($burger, $sidebar, $overlay, $innerWrapper);            
        });

        if (settings.fixedSidebar) {
            $(window).scroll(function() {
                console.log('scroll')
                _this.positionWrappers($burger, $sidebar, $innerWrapper);
            });
        }
    }

    MobileMenu.prototype.animate = function($burger, $sidebar, $innerWrapper, $overlay) {
        var _this = this;
        var _slideDuration = settings.slideDuration;
        var _burgerVisible = settings.burgerVisible;
        var _activeOverlay = settings.activeOverlayClass;

        $burger.click(function() {
            //make sure that sidebar is visible when animation happens
            $sidebar.show();

            //alternate between slideout and slidein depending on whether the menu is open
            if (!_this.getOpenMenuStatus()) {
                _this.slideOut($sidebar, $innerWrapper);
            } else {
                _this.slideIn($sidebar, $innerWrapper);            
            }

            //switch the menu status
            _this.setOpenMenuStatus(!(_this.getOpenMenuStatus()));

            //add the activeOverlay if the menu is open; otherwise, make sure it is removed
            if (_this.getOpenMenuStatus()) {
                $overlay.addClass(_activeOverlay);
            } else {
                $overlay.removeClass(_activeOverlay);
            }

            //hide burger if user sets burgerVisible to false
            if (!_burgerVisible) {
                $burger.hide();
            }  
        }); 

        $overlay.click(function() {

            $innerWrapper.animate(_this.updateWrapperPosition(), _slideDuration, function() {
                //burger may have been hidden due to input from user
                $burger.show();
            });

            if (settings.fixedSidebar) {
                $sidebar.css({'position': 'absolute'});
            }
            _this.setFixedSidebarStatus(!(_this.getFixedSidebarStatus()));
            _this.setOpenMenuStatus(!(_this.getOpenMenuStatus()));
            $overlay.removeClass(_activeOverlay);
        });   
    }

    MobileMenu.prototype.slideIn = function($sidebar, $innerWrapper) {
        var _this = this;
        var _slideDuration = settings.slideDuration;

        if (settings.fixedSidebar) {
            if (this.getFixedSidebarStatus() && this.getOpenMenuStatus()) {
                $sidebar.css({'position': 'absolute'});
                this.setFixedSidebarStatus(!(this.getFixedSidebarStatus()));  
            }
        }
        $innerWrapper.animate(_this.updateWrapperPosition(), _slideDuration)
    }

    MobileMenu.prototype.slideOut = function($sidebar, $innerWrapper) {
        var _this = this;
        var _slideDuration = settings.slideDuration;

        $innerWrapper.animate(_this.updateWrapperPosition(), _slideDuration, function() {
            if (settings.fixedSidebar) {
                if (!(_this.getFixedSidebarStatus())) {
                    $sidebar.css({'position': 'fixed'});
                    _this.setFixedSidebarStatus(!(_this.getFixedSidebarStatus()));
                } 
            }
        })
    }

    MobileMenu.prototype.updateWrapperPosition = function() {
        //Updates inner wrapper position depending on whether menu is open/closed and sidebar is left/right
        if (this.getOpenMenuStatus()) {
            if (settings.sidebarLocation === "left") {
                    console.log("open menu left") 
                    return {left: "-=" + settings.slideDistance + "px"}
                } else if (settings.sidebarLocation === "right") {
                    console.log("open menu right") 
                    return {right: "-=" + settings.slideDistance + "px"}

                }
        }   else {
                if (settings.sidebarLocation === "left") {
                    console.log("close menu left") 
                    return {left: "+=" + settings.slideDistance + "px"}
                } else if (settings.sidebarLocation === "right") {
                    console.log("close menu right")
                    return {right: "+=" + settings.slideDistance + "px"}

                }
            }                   
    }          

    $.fn.mobilemenu = function(options) {
        return this.each(function() {
            new MobileMenu(this, options);
        })
    }

})(jQuery);
