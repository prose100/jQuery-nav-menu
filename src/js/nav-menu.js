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
        moveInnerWrapperX: 0,
        moveInnerWrapperY: 0,
        burgerSpanHeight: 5,
        burgerSpanWidth: 30,
        burgerSpacing: 4,
        burgerColor: '#777',
        burgerVisible: true,
        fixedBurger: true,
        fixedSidebar: true,
        burgerClass: 'burger',
        sidebarClass: 'sidebar',
        innerWrapperClass: 'innerWrapper',
        outerWrapperClass: 'outerWrapper',
        overlayClass: 'overlay',
        activeOverlayClass: 'activeOverlay'
    }

    //Definitions:
        //----------------------------------------------------//
        //burger: three separated spans
        //sidebar: div that holds nav-menu (see ~line 145)
        //innerWrapper: div that holds burger and sidebar 
                //burger and sidebar are placed absolutely within its relative position
                //z-index above everything, making burger and sidebar uniquely clickable
                //does not require a height
        //outerWrapper: div that holds innerWrapper
                //div block that lies over floated elements (like logo and nav-menu)
                //innerWrapper is placed relative to the outerWrapper's static position,
                   //so that right: -200px means 200px of innerWrapper is shifted off the right side of the screen
                //does not require a height
        //-----------------------------------------------------//        
        //overlay: div that is equivalent to the body,
                //when clicked on the menu closes  
        //activeOverlay: div that is same as overlay, 
                //except that it appears only when menu is open
                //not used at the moment, but may be incorporated 
                    //to put a shade over body when menu is open
        //-----------------------------------------------------//

    function MobileMenu (element, options) {
        settings = $.extend({}, defaults, options);
        $this = $(element);
        this.init();    
    }

    MobileMenu.prototype.init = function() {
        //Initial OpenMenuStatus; starts Not(false) Open
        var openMenuStatus = false;
        this.setOpenMenuStatus(openMenuStatus);

        var $burger = this.createBurger();
        var $sidebar = this.createSidebar();
        
        //Creates outerWrapper and innerWrapper, but just returns innerWrapper
        var $innerWrapper = this.createWrappers($burger, $sidebar);
        var $overlay = this.createOverlay();

        this.statusInnerWrapper($innerWrapper, 'init');
        this.positionBurger($burger, $sidebar);
        this.positionSidebar($burger, $sidebar);
        this.positionInnerWrapper($burger, $sidebar, $innerWrapper);
        
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

        var $spanMiddle = this.createSpan();
        $spanMiddle.appendTo($burger);

        $spanMiddle.css({'margin-top': settings.burgerSpacing, 'margin-bottom': settings.burgerSpacing});

        var $spanTop = this.createSpan();
        $spanTop.insertBefore($spanMiddle);
        var $spanBottom = this.createSpan();
        $spanBottom.insertAfter($spanMiddle);

        //burger is placed absolutely within the innerWrapper
        $burger.css({
            'cursor':'pointer',
            'position':'absolute'
        });
 
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

        //sidebar is placed absolutely within the innerWrapper
        $sidebar.css({
            'list-style':'none',
            'position':'absolute'
        })
        return $sidebar;
    }

    MobileMenu.prototype.positionSidebar = function($burger, $sidebar) {
        var browserPositionY =  window.pageYOffset || document.documentElement.scrollTop;

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

        //burger and sidebar are placed absolutely within the relatively positioned innerWrapper
        $innerWrapper.css({
            'position':'relative',
            'z-index':'9999'
        });
    
        return $innerWrapper;
    }

    MobileMenu.prototype.statusInnerWrapper = function($innerWrapper, condition) {
        //initial state of innerWrapper is relative, or not Fixed
        if (condition == "init") {
            //innerWrapper changes to fixed if fixedBurger in its initial condition
            //otherwise, stays relative
            if (settings.fixedBurger) {
                $innerWrapper.css({'position':'fixed'});
            }
        }
        if (condition == 'slideOut') {
            if (settings.fixedBurger && !settings.fixedSidebar) {
                $innerWrapper.css({'position':'relative'}); 
            }
            if (!settings.fixedBurger && settings.fixedSidebar) {
                $innerWrapper.css({'position':'fixed'});
            }
        }
        if (condition == 'slideIn') {
            if (settings.fixedBurger && !settings.fixedSidebar) {
                $innerWrapper.css({'position':'fixed'}); 
            }
            if (!settings.fixedBurger && settings.fixedSidebar) {
                $innerWrapper.css({'position':'relative'});
            }
        }
    }

     MobileMenu.prototype.positionInnerWrapper = function($burger, $sidebar, $innerWrapper) {
        var _sidebarLocation = settings.sidebarLocation;

        // var browserPositionY =  window.pageYOffset || document.documentElement.scrollTop;

        if (_sidebarLocation === "right" && this.getOpenMenuStatus()) {
            //right and open
            $innerWrapper.css({right:settings.moveInnerWrapperX, top: settings.moveInnerWrapperY});

            } else if (_sidebarLocation === "right") {
                //right and close               
                $innerWrapper.css({right:-$sidebar.width()+settings.moveInnerWrapperX, top: settings.moveInnerWrapperY});
            } 

        if (_sidebarLocation === "left" && this.getOpenMenuStatus()) {
            //left and open
            $innerWrapper.css({left:settings.moveInnerWrapperX, top: settings.moveInnerWrapperY});
            
            } else if (_sidebarLocation === "left") {
                //left and close
                $innerWrapper.css({left:-$sidebar.width()+settings.moveInnerWrapperX, top: settings.moveInnerWrapperY});
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
            _this.positionInnerWrapper($burger, $sidebar, $innerWrapper);
            _this.configDisplay($burger, $sidebar, $overlay, $innerWrapper);            
        });

        //innerWrapper moves along browser window when scrolling takes place; hence, it behaves as fixed
        if (settings.fixedSidebar) {
            $(window).scroll(function() {
                _this.positionInnerWrapper($burger, $sidebar, $innerWrapper);
            });
        }
    }

    MobileMenu.prototype.animate = function($burger, $sidebar, $innerWrapper, $overlay) {
        var _this = this;
        var _slideDuration = settings.slideDuration;
        var _burgerVisible = settings.burgerVisible;
        var _activeOverlay = settings.activeOverlayClass;

        //burger click event
        $burger.click(function() {
            //make sure that sidebar is visible when animation happens
            $sidebar.show();

            //alternate between slideout and slidein depending on whether the menu is open
            if (!_this.getOpenMenuStatus()) {
                _this.slideOut($innerWrapper);
            } else {
                _this.slideIn($innerWrapper);        
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

        //overlay click event
        $overlay.click(function() {
             _this.slideIn($innerWrapper);

            //switch the menu status
            _this.setOpenMenuStatus(!(_this.getOpenMenuStatus()));

            //remove activeOverlay
            $overlay.removeClass(_activeOverlay);
       });   
    }

    MobileMenu.prototype.slideIn = function($innerWrapper, cb) {
        var _this = this;
    
        $innerWrapper.animate(_this.updateWrapperPosition(), settings.slideDuration, function() {
            _this.statusInnerWrapper($innerWrapper, 'slideIn');
        });
    }

    MobileMenu.prototype.slideOut = function($innerWrapper, cb) {
        var _this = this;
 
        $innerWrapper.animate(_this.updateWrapperPosition(), settings.slideDuration, function() {
            _this.statusInnerWrapper($innerWrapper, 'slideOut'); 
        })
    }

    MobileMenu.prototype.updateWrapperPosition = function() {
        //Updates inner wrapper position depending on whether menu is open/closed and sidebar is left/right
        if (this.getOpenMenuStatus()) {
            if (settings.sidebarLocation === "left") {
                    return {left: "-=" + settings.slideDistance + "px"}
            } else if (settings.sidebarLocation === "right") {  
                    return {right: "-=" + settings.slideDistance + "px"}
            }
        } else {
            if (settings.sidebarLocation === "left") {         
                return {left: "+=" + settings.slideDistance + "px"}
            } else if (settings.sidebarLocation === "right") {
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
