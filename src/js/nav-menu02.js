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

    function MobileMenu2 (element, options) {
        settings2 = $.extend({}, defaults, options);
        $this2 = $(element);
        this.init();       
    }

    MobileMenu2.prototype.init = function() {
        //Initial OpenMenuStatus; starts Not(false) Open
        var openMenuStatus = false;
        this.setOpenMenuStatus(openMenuStatus);

        var $burger = this.createBurger();
        var $sidebar = this.createSidebar();
        
        //Creates outerWrapper and innerWrapper, but just returns innerWrapper
        var $innerWrapper = this.createWrappers($burger, $sidebar);
        var $overlay = this.createOverlay();

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
    MobileMenu2.prototype.getOpenMenuStatus = function() {
        return this.openMenuStatus;
    }

    MobileMenu2.prototype.setOpenMenuStatus = function(openMenuStatus) {
        this.openMenuStatus = openMenuStatus;
    }

    /* ---------------------------------------------
        Checks if window is in Mobile Mode
       --------------------------------------------- */
     MobileMenu2.prototype.isMobile = function() {
        return ($(window).width()<settings2.windowWidth);
    }

    /* ---------------------------------------------
        Burger 
       --------------------------------------------- */
    MobileMenu2.prototype.createBurger = function() {
        var $burger = $('<div>').attr('class', settings2.burgerClass)

        var $spanMiddle = this.createSpan();
        $spanMiddle.appendTo($burger);

        $spanMiddle.css({'margin-top': settings2.burgerSpacing, 'margin-bottom': settings2.burgerSpacing});

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

    MobileMenu2.prototype.createSpan = function() {
        return $('<span>').css(this.spanProperties());
    }

    MobileMenu2.prototype.spanProperties = function() {
        return {'height': settings2.burgerSpanHeight,
                'width': settings2.burgerSpanWidth,
                'background': settings2.burgerColor,
                'display': 'block'}
    }

    MobileMenu2.prototype.positionBurger = function($burger, $sidebar) {
        if (settings2.sidebarLocation === "right") {
            $burger.css({right: $sidebar.width()+settings2.moveBurgerX, top: settings2.moveBurgerY});
            } else {
                $burger.css({left: $sidebar.width()+settings2.moveBurgerX, top: settings2.moveBurgerY});
            }
    }

    /* ---------------------------------------------
        Sidebar
       --------------------------------------------- */
    MobileMenu2.prototype.createSidebar = function() {
        //Portion of code where html may added to place more content in the menu
        var $sidebar = $('<ul>').attr('class', settings2.sidebarClass)
        $this2.children().css({}).clone().appendTo($sidebar);

        //sidebar is placed absolutely within the innerWrapper
        $sidebar.css({
            'list-style':'none',
            'position':'absolute'
        })
        return $sidebar;
    }

    MobileMenu2.prototype.positionSidebar = function($burger, $sidebar) {
        var browserPositionY =  window.pageYOffset || document.documentElement.scrollTop;

        if (settings2.sidebarLocation === "right") {
            $sidebar.css({right: settings2.moveSidebarX, top: settings2.moveSidebarY}); 
        } else {
            $sidebar.css({left: settings2.moveSidebarX, top: settings2.moveSidebarY}); 
        }
    }

    /* ---------------------------------------------
        Wrappers
       --------------------------------------------- */
    MobileMenu2.prototype.createWrappers = function($burger, $sidebar) {
        var $outerWrapper = $('<div>').attr('class', settings2.outerWrapperClass).insertAfter($this2);
        var $innerWrapper = $('<div>').attr('class', settings2.innerWrapperClass)

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

     MobileMenu2.prototype.positionInnerWrapper = function($burger, $sidebar, $innerWrapper) {
        var _sidebarLocation = settings2.sidebarLocation;

        // var browserPositionY =  window.pageYOffset || document.documentElement.scrollTop;

        if (_sidebarLocation === "right" && this.getOpenMenuStatus()) {
            //right and open
            $innerWrapper.css({right:settings2.moveInnerWrapperX, top: settings2.moveInnerWrapperY});

            } else if (_sidebarLocation === "right") {
                //right and close               
                $innerWrapper.css({right:-$sidebar.width()+settings2.moveInnerWrapperX, top: settings2.moveInnerWrapperY});
            } 

        if (_sidebarLocation === "left" && this.getOpenMenuStatus()) {
            //left and open
            $innerWrapper.css({left:settings2.moveInnerWrapperX, top: settings2.moveInnerWrapperY});
            
            } else if (_sidebarLocation === "left") {
                //left and close
                $innerWrapper.css({left:-$sidebar.width()+settings2.moveInnerWrapperX, top: settings2.moveInnerWrapperY});
            }
    }

    /* ---------------------------------------------
        Overlay
       --------------------------------------------- */
    MobileMenu2.prototype.createOverlay = function() {
            var $overlay = $('<div>');
            $overlay.addClass(settings2.overlayClass);
            $('body').prepend($overlay);
        return $overlay;
    }

   /* ---------------------------------------------
        Display
      --------------------------------------------- */
    MobileMenu2.prototype.configDisplay = function($burger, $sidebar, $overlay) {
        if (this.isMobile() && this.getOpenMenuStatus()) {
            $sidebar.show();
            $this2.hide();
            } else if (this.isMobile()) {
                $sidebar.hide(); 
                $this2.hide();
                $burger.show();
            } else if (this.getOpenMenuStatus()) {
                $sidebar.hide();
                $this2.show();
                $burger.hide();
                this.setOpenMenuStatus(false);
                $overlay.removeClass(settings2.activeOverlayClass);
            } else {
                $sidebar.hide();
                $this2.show();
                $burger.hide();
            }
    }

     /* ---------------------------------------------
        Animate
        --------------------------------------------- */
    MobileMenu2.prototype.resizeWindow = function($burger, $sidebar, $innerWrapper, $overlay) {
        var _this = this;

        $(window).resize(function() {
            _this.positionInnerWrapper($burger, $sidebar, $innerWrapper);
            _this.configDisplay($burger, $sidebar, $overlay, $innerWrapper);            
        });

        //innerWrapper moves along browser window when scrolling takes place; hence, it behaves as fixed
        if (settings2.fixedSidebar) {
            $(window).scroll(function() {
                _this.positionInnerWrapper($burger, $sidebar, $innerWrapper);
            });
        }
    }

    MobileMenu2.prototype.animate = function($burger, $sidebar, $innerWrapper, $overlay) {
        var _this = this;
        var _slideDuration = settings2.slideDuration;
        var _burgerVisible = settings2.burgerVisible;
        var _activeOverlay = settings2.activeOverlayClass;

        //burger click event
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

        //overlay click event
        $overlay.click(function() {
             _this.slideIn($sidebar, $innerWrapper);

            //switch the menu status
            _this.setOpenMenuStatus(!(_this.getOpenMenuStatus()));

            //remove activeOverlay
            $overlay.removeClass(_activeOverlay);
       });   
    }

    MobileMenu2.prototype.slideIn = function($sidebar, $innerWrapper, cb) {
        var _this = this;
    
        $innerWrapper.animate(_this.updateWrapperPosition(), settings2.slideDuration, function() {
            if (!settings2.fixedBurger) {
                $innerWrapper.css({'position': 'relative'});
            }
        });
    }

    MobileMenu2.prototype.slideOut = function($sidebar, $innerWrapper, cb) {
        var _this = this;
 
        $innerWrapper.animate(_this.updateWrapperPosition(), settings2.slideDuration, function() {
            if (settings2.fixedSidebar) {
                $innerWrapper.css({'position': 'fixed'});
            }  
        })
    }

    MobileMenu2.prototype.updateWrapperPosition = function() {
        //Updates inner wrapper position depending on whether menu is open/closed and sidebar is left/right
        if (this.getOpenMenuStatus()) {
            if (settings2.sidebarLocation === "left") {
                    return {left: "-=" + settings2.slideDistance + "px"}
            } else if (settings2.sidebarLocation === "right") {  
                    return {right: "-=" + settings2.slideDistance + "px"}
            }
        } else {
            if (settings2.sidebarLocation === "left") {         
                return {left: "+=" + settings2.slideDistance + "px"}
            } else if (settings2.sidebarLocation === "right") {
                return {right: "+=" + settings2.slideDistance + "px"}
            }
        }                   
    }          

    $.fn.mobilemenu2 = function(options) {
        return this.each(function() {
            new MobileMenu2(this, options);
        })
    }

})(jQuery);
