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
        burgerVisible: false,
        fixedBurger: false,
        fixedSidebar: false,
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
                //this class may be called out in css to place transparent black background over website content
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

        var offsetChangeFromResizeWindow = 0;
        this.setOffsetChangeFromResizeWindow(offsetChangeFromResizeWindow);

        var checkIfJustChangedTofMobile = false;
        this.setCheckIfJustChangedToMobile(checkIfJustChangedTofMobile);

        var resize = true;
        this.setResize(resize);

        var scroll = true;
        this.setScroll(scroll);

        var $burger = this.createBurger();
        var $sidebar = this.createSidebar();
        
        //Creates outerWrapper and innerWrapper, but just returns innerWrapper
        var $innerWrapper = this.createWrappers($burger, $sidebar);
        var $overlay = this.createOverlay();

        this.setInitialInnerWrapperLocation($innerWrapper);
        this.setDocumentHeight($(document).height());
        this.setPositionPropertyInnerWrapper($sidebar, $innerWrapper, 'init');
        this.positionBurger($burger, $sidebar);
        this.positionSidebar($burger, $sidebar);
        
        this.configDisplay($burger, $sidebar, $innerWrapper, $overlay);

        this.resizeWindow($burger, $sidebar, $innerWrapper, $overlay);
        this.scrollWindow($sidebar, $innerWrapper);

        this.animate($burger, $sidebar, $innerWrapper, $overlay);
    }

    /* ---------------------------------------------
       Getters and Setters         
       --------------------------------------------- */

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
            Getter and Setter for DocumentHeight
           --------------------------------------------- */
        MobileMenu.prototype.getDocumentHeight = function() {
            return this.documentHeight
        }

        MobileMenu.prototype.setDocumentHeight = function(documentHeight) {
            this.documentHeight = documentHeight;
        }

         /* ---------------------------------------------
            Getter and Setter for IsResizedWindow
           --------------------------------------------- */
        MobileMenu.prototype.getOffsetChangeFromResizeWindow = function() {
            return this.offsetChangeDueResizeWindow;
        }

        MobileMenu.prototype.setOffsetChangeFromResizeWindow = function(offsetChangeDueResizeWindow) {
            this.offsetChangeDueResizeWindow = offsetChangeDueResizeWindow;
        }

        /* ---------------------------------------------
            Getter and Setter for InnerWrapperLocation
           --------------------------------------------- */
        MobileMenu.prototype.getInnerWrapperLocation = function() {
            return this.innerWrapperLocation;
        }

        MobileMenu.prototype.setInnerWrapperLocation = function(innerWrapperLocation) {
            this.innerWrapperLocation = innerWrapperLocation;
        }

        /* ---------------------------------------------
            Getter and Setter for InitialInnerWrapperLocation
           --------------------------------------------- */
        MobileMenu.prototype.getInitialInnerWrapperLocation = function() {
            return this.initialInnerWrapperLocation;
        }

        MobileMenu.prototype.setInitialInnerWrapperLocation = function($innerWrapper) {
            //set one time
            var initialInnerWrapperLocation;
            initialInnerWrapperLocation = {
                    ytop : $innerWrapper.offset().top        
                }          
            this.initialInnerWrapperLocation = initialInnerWrapperLocation;
        }

        /* ---------------------------------------------
            Getter and Setter for CheckIfJustChangedTofMobile
        --------------------------------------------- */

        MobileMenu.prototype.getCheckIfJustChangedToMobile = function() {
            return this.checkIfJustChangedToMobile;
        }

        MobileMenu.prototype.setCheckIfJustChangedToMobile = function(checkIfJustChangedToMobile) {
            this.checkIfJustChangedToMobile = checkIfJustChangedToMobile;
        }

        /* ---------------------------------------------
            Getter and Setter for Resize
        --------------------------------------------- */

        MobileMenu.prototype.getResize = function() {
            return this.resize;
        }

        MobileMenu.prototype.setResize = function(resize) {
            this.resize = resize;
        }

        /* ---------------------------------------------
            Getter and Setter for Scroll
        --------------------------------------------- */

        MobileMenu.prototype.getScroll = function() {
            return this.scroll;
        }

        MobileMenu.prototype.setScroll = function(scroll) {
            this.scroll = scroll;
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
    
    //offsetChangeFromResizeWindow determines the adjustment necessary in the innerWrapper's y location since the background of the website 
        //changes behind the burger and sidebar as the window is resized.  This adjustment prevents the sidebar and burger from jumping up or down
        //after the menu slides in or out.
    MobileMenu.prototype.offsetChangeFromResizeWindow = function($innerWrapper) {

        //as the window is resized with menu open, header's change in y with respect to its original position 
        this.setOffsetChangeFromResizeWindow($(".header").offset().top - this.getInitialInnerWrapperLocation().ytop);             
    }

    //offsetWrappers determines the ytop-location of the innerWrapper
        //Note: it gets called at the start of the program and when the menu slides out and slides in
        //Note: it calls getOffsetChangeFromResizeWindow
    MobileMenu.prototype.offsetWrappers = function($innerWrapper, type) {
        var innerWrapperLocation;

        if (type == 'reset-relative') {
            innerWrapperLocation = {
                ytop : 0            
            }
        }
        if (type == 'reset-fixed') {
            innerWrapperLocation = {
                ytop : $(".header").offset().top           
            }
        }
        if (type == 'relative') {
            innerWrapperLocation = {
                //current position relative to innerWrapper's initial position minus offsetChangeFromResizeWindow
                ytop : ($innerWrapper.offset().top - this.getInitialInnerWrapperLocation().ytop) - this.getOffsetChangeFromResizeWindow()
            }
        }
        if (type == 'fixed') {
            innerWrapperLocation = {
                //current innerWrapper position from top of browser window
                ytop : $innerWrapper.offset().top - $(window).scrollTop()
            }
        }
        this.setInnerWrapperLocation(innerWrapperLocation);
    }

    //setPositionPropertryInnerWrapper sets the innerWrapper as 'fixed' or 'relative' depending on the user's inputs
        //Note: it calls offsetWrappers in conjunction with its 'fixed' or 'relative' position property
        //Note: initial state of innerWrapper is relative, or not Fixed
    MobileMenu.prototype.setPositionPropertyInnerWrapper = function($sidebar, $innerWrapper, condition) {
        
        if (condition == "init") {
            //innerWrapper changes to fixed if fixedBurger is true; otherwise, stays relative
                //Note: if fixedSidebar is also true, innerWrapper will always remain fixed
            if (settings.fixedBurger) {
                this.offsetWrappers($innerWrapper, 'reset-fixed');
                this.locateInnerWrapper($sidebar, $innerWrapper);
                $innerWrapper.css({'position':'fixed'});
            } else {
                this.offsetWrappers($innerWrapper, 'reset-relative');
                this.locateInnerWrapper($sidebar, $innerWrapper);   
            }
        }
        if (condition == 'slideOut') {
            if (settings.fixedBurger && !settings.fixedSidebar) {
                this.offsetWrappers($innerWrapper, 'relative');
                this.locateInnerWrapper($sidebar, $innerWrapper);
                $innerWrapper.css({'position':'relative'});
            }
            if (!settings.fixedBurger && settings.fixedSidebar) {
                this.offsetWrappers($innerWrapper, 'fixed');
                this.locateInnerWrapper($sidebar, $innerWrapper);
                $innerWrapper.css({'position':'fixed'});
            }
        }
        if (condition == 'slideIn') {
            if (settings.fixedBurger && !settings.fixedSidebar) {
                this.offsetWrappers($innerWrapper, 'fixed');
                this.locateInnerWrapper($sidebar, $innerWrapper);
                $innerWrapper.css({'position':'fixed'});
            }
            if (!settings.fixedBurger && settings.fixedSidebar) {
                this.offsetWrappers($innerWrapper, 'relative');
                this.locateInnerWrapper($sidebar, $innerWrapper);
                $innerWrapper.css({'position':'relative'});
            }
        }
    }

    //locateInnerWrapper sets the innerWrapper at its location determined by the previous three functions
    MobileMenu.prototype.locateInnerWrapper = function($sidebar, $innerWrapper) {
        var _sidebarLocation = settings.sidebarLocation;
        console.log(this.getInnerWrapperLocation().ytop);

        if (_sidebarLocation === "right" && this.getOpenMenuStatus()) {
            //right and open
            $innerWrapper.css({top: settings.moveInnerWrapperY+this.getInnerWrapperLocation().ytop});

            } else if (_sidebarLocation === "right") {
                //right and close               
                $innerWrapper.css({right:-$sidebar.width()+settings.moveInnerWrapperX, top: settings.moveInnerWrapperY+this.getInnerWrapperLocation().ytop});
            } 

        if (_sidebarLocation === "left" && this.getOpenMenuStatus()) {
            //left and open
            $innerWrapper.css({top: settings.moveInnerWrapperY+this.getInnerWrapperLocation().ytop});
            
            } else if (_sidebarLocation === "left") {
                //left and close
                $innerWrapper.css({left:-$sidebar.width()+settings.moveInnerWrapperX, top: settings.moveInnerWrapperY+this.getInnerWrapperLocation().ytop});
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
    MobileMenu.prototype.configDisplay = function($burger, $sidebar, $innerWrapper, $overlay) {
        if (this.isMobile() && this.getOpenMenuStatus()) {
            $sidebar.show();
            $this.hide();
            
            } else if (this.isMobile()) {
                $sidebar.hide(); 
                $this.hide();
                $burger.show();
    
                //check to see if screen has just gone from desktop to mobile
                if (this.getCheckIfJustChangedToMobile()) {
                    this.setPositionPropertyInnerWrapper($sidebar, $innerWrapper, 'init');
                    this.setCheckIfJustChangedToMobile(false);
                }
            
            } else if (this.getOpenMenuStatus()) {
                $sidebar.hide();
                $this.show();
                $burger.hide();
                this.setCheckIfJustChangedToMobile(true);
                
                //Note: with the menu open before going to desktop view, 'slideIn' must be run on the innerWrapper
                this.setPositionPropertyInnerWrapper($sidebar, $innerWrapper, 'slideIn');

                this.setOpenMenuStatus(false);
                $overlay.removeClass(settings.activeOverlayClass);
           
           } else {
                $sidebar.hide();
                $this.show();
                $burger.hide();
                this.setCheckIfJustChangedToMobile(true);       
            }
    }

    /* ---------------------------------------------
        Animate
       --------------------------------------------- */

    MobileMenu.prototype.resizeWindow = function($burger, $sidebar, $innerWrapper, $overlay) {
        var _this = this;

        $(window).resize(function() {
            _this.locateInnerWrapper($sidebar, $innerWrapper);
            _this.configDisplay($burger, $sidebar, $innerWrapper, $overlay);
            _this.offsetChangeFromResizeWindow($innerWrapper);

            if (_this.getResize()) {
                 _this.setResize(false);
                _this.setScroll(true); 
            }
            _this.offsetWrappers($innerWrapper, 'relative');
            $innerWrapper.css({'position':'relative'});                
        });
    }

    MobileMenu.prototype.scrollWindow = function($sidebar, $innerWrapper) {
        var _this = this;

        $(window).scroll(function() {
            if (_this.getScroll()) {
                _this.setPositionPropertyInnerWrapper($sidebar, $innerWrapper, 'init');
                _this.setScroll(false);
                _this.setResize(true);
            }
        });
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
                _this.slideOut($burger, $sidebar, $innerWrapper);
            } else {
                _this.slideIn($burger, $sidebar, $innerWrapper);        
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
             _this.slideIn($burger, $sidebar, $innerWrapper);

            //switch the menu status
            _this.setOpenMenuStatus(!(_this.getOpenMenuStatus()));

            //remove activeOverlay
            $overlay.removeClass(_activeOverlay);
       });   
    }

    MobileMenu.prototype.slideIn = function($burger, $sidebar, $innerWrapper) {
        var _this = this;
        var _burgerVisible = settings.burgerVisible;

        $innerWrapper.animate(_this.updateWrapperPosition(), settings.slideDuration, function() {
            _this.setPositionPropertyInnerWrapper($sidebar, $innerWrapper, 'slideIn');
             
             //show burger if user sets burgerVisible to false
            if (!_burgerVisible) {
                $burger.show();
            }  
        });
    }

    MobileMenu.prototype.slideOut = function($burger, $sidebar, $innerWrapper) {
        var _this = this;
        var _burgerVisible = settings.burgerVisible;
 
        $innerWrapper.animate(_this.updateWrapperPosition(), settings.slideDuration, function() {
            _this.setPositionPropertyInnerWrapper($sidebar, $innerWrapper, 'slideOut'); 
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
