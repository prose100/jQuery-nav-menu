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
        moveOuterWrapperX: 0,
        moveOuterWrapperY: 0,
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
        overallWrapperClass: 'overallWrapper',
        overlayClass: 'overlay',
        activeOverlayClass: 'activeOverlay'
    }

    //Definitions:
        //----------------------------------------------------//
        //burger: three separated spans
        //sidebar: div that holds contents of nav-menu (see ~line 255)
        //innerWrapper: div that holds burger and sidebar 
                //burger and sidebar are placed absolutely within its relative position
                //z-index above everything, making burger and sidebar uniquely clickable
                //does not require a height
        //outerWrapper: div that holds innerWrapper
                //outerWrapper's position is changed from relative to fixed and vice versa to
                    //satisfy the user's inputs for fixedBurger and fixedSidebar                 
        //overallWrapper: div that holds outerWrapper
                //div that shifts margins to handle padding and margins added to elements that may hold it
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
        var $wrappers = this.createWrappers($burger, $sidebar);
        var $overlay = this.createOverlay();

        this.overallWrapperPMLeftAndPMRight($wrappers.overallWrapper);
        this.setProperties();

        this.setInitialOuterWrapperLocation($wrappers.outerWrapper);
        this.setDocumentHeight($(document).height());
        this.setPositionPropertyOuterWrapper($sidebar, $wrappers.outerWrapper, $wrappers.overallWrapper, 'init');
        this.positionBurger($burger, $sidebar);
        this.positionSidebar($burger, $sidebar);
        
        this.configDisplay($burger, $sidebar, $wrappers.innerWrapper, $wrappers.outerWrapper, $wrappers.overallWrapper, $overlay);

        this.resizeWindow($burger, $sidebar, $wrappers.innerWrapper, $wrappers.outerWrapper, $wrappers.overallWrapper, $overlay);
        this.scrollWindow($sidebar, $wrappers.outerWrapper, $wrappers.overallWrapper);

        this.animate($burger, $sidebar, $wrappers.innerWrapper, $wrappers.outerWrapper, $wrappers.overallWrapper, $overlay);
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
            Getter and Setter for OffsetChangeFromResizeWindow
           --------------------------------------------- */
        MobileMenu.prototype.getOffsetChangeFromResizeWindow = function() {
            return this.offsetChangeDueResizeWindow;
        }

        MobileMenu.prototype.setOffsetChangeFromResizeWindow = function(offsetChangeDueResizeWindow) {
            this.offsetChangeDueResizeWindow = offsetChangeDueResizeWindow;
        }

        /* ---------------------------------------------
            Getter and Setter for OuterWrapperLocation
           --------------------------------------------- */
        MobileMenu.prototype.getOuterWrapperLocation = function() {
            return this.outerWrapperLocation;
        }

        MobileMenu.prototype.setOuterWrapperLocation = function(outerWrapperLocation) {
            this.outerWrapperLocation = outerWrapperLocation;
        }

        /* ---------------------------------------------
            Getter and Setter for InitialOuterWrapperLocation
           --------------------------------------------- */
        MobileMenu.prototype.getInitialOuterWrapperLocation = function() {
            return this.initialOuterWrapperLocation;
        }

        MobileMenu.prototype.setInitialOuterWrapperLocation = function($outerWrapper) {
            //set one time
            var initialOuterWrapperLocation;
            initialOuterWrapperLocation = {
                    ytop : $outerWrapper.offset().top        
                }          
            this.initialOuterWrapperLocation = initialOuterWrapperLocation;
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
        Properties
       --------------------------------------------- */
    MobileMenu.prototype.setProperties = function() {
        $('body').css({
            'overflow-x':'hidden'
        })
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
            'position':'absolute',
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

    MobileMenu.prototype.visibleBurger = function($burger) {
        var _burgerVisible = settings.burgerVisible;

        //show burger if user sets burgerVisible to false
        if (!_burgerVisible) {
            $burger.show();
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
            'position':'absolute',
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
        var $overallWrapper = $('<div>').attr('class', settings.overallWrapperClass).insertAfter($this);
        var $outerWrapper = $('<div>').attr('class', settings.outerWrapperClass);
        var $innerWrapper = $('<div>').attr('class', settings.innerWrapperClass);

        $burger.appendTo($innerWrapper);
        $sidebar.appendTo($innerWrapper);
        $innerWrapper.appendTo($outerWrapper);
        $outerWrapper.appendTo($overallWrapper);

        //burger and sidebar are placed absolutely within the relatively positioned innerWrapper
        $innerWrapper.css({
            'position':'relative',
        });

        $overallWrapper.css({
            'display':'inline-block',
            'height':$burger.height(),
            'z-index':'9999',
            'position':'relative',
        })

        //burger shows up on the right side of the browser window
        if (settings.sidebarLocation == 'right') {
            $overallWrapper.css({
                'left':$(window).width()
            })
        }

        $wrappers = {
            innerWrapper : $innerWrapper,
            outerWrapper : $outerWrapper,
            overallWrapper : $overallWrapper
        }

        return $wrappers;
    }

    //offsetChangeFromResizeWindow determines the adjustment necessary in the outerWrapper's y location since the background of the website 
        //changes behind the burger and sidebar as the window is resized.  This adjustment prevents the sidebar and burger from jumping up or down
        //after the menu slides in or out.
    MobileMenu.prototype.offsetChangeFromResizeWindow = function($overallWrapper) {
        //as the window is resized with menu open, burger's change in y with respect to its original position 
        this.setOffsetChangeFromResizeWindow($overallWrapper.offset().top - this.getInitialOuterWrapperLocation().ytop);             
    }

    //offsetWrappers determines the ytop-location of the outerWrapper
        //Note: it gets called at the start of the program and when the menu slides out and slides in
        //Note: it calls getOffsetChangeFromResizeWindow
    MobileMenu.prototype.offsetWrappers = function($outerWrapper, $overallWrapper, type) {
        var outerWrapperLocation;

        if (type == 'reset-relative') {
            outerWrapperLocation = {
                ytop : 0            
            }
        }
        if (type == 'reset-fixed') {
            outerWrapperLocation = {
                ytop : $overallWrapper.offset().top           
            }
        }
        if (type == 'relative') {
            outerWrapperLocation = {
                //current position relative to outerWrapper's initial position minus offsetChangeFromResizeWindow
                ytop : ($outerWrapper.offset().top - this.getInitialOuterWrapperLocation().ytop) - this.getOffsetChangeFromResizeWindow()
            }
        }
        if (type == 'fixed') {
            if ($outerWrapper.offset().top - $(window).scrollTop() < 0) {
                //if outerWrapper position is off the top of the screen
                outerWrapperLocation = {
                    ytop : this.getInitialOuterWrapperLocation().ytop
                }
            } else if ($outerWrapper.offset().top - $(window).scrollTop() > $(window).height()) {
                //if outerWrapper position is off the bottom of the screen
                outerWrapperLocation = {
                    ytop : this.getInitialOuterWrapperLocation().ytop
                }
            } else {
                outerWrapperLocation = {
                    //current outerWrapper position from top of browser window
                    ytop : $outerWrapper.offset().top - $(window).scrollTop()
                }
            }
        }
        this.setOuterWrapperLocation(outerWrapperLocation);
    }

    //setPositionPropertryOuterWrapper sets the outerWrapper as 'fixed' or 'relative' depending on the user's inputs
        //Note: it calls offsetWrappers in conjunction with its 'fixed' or 'relative' position property
        //Note: initial state of outerWrapper is relative, or not Fixed
    MobileMenu.prototype.setPositionPropertyOuterWrapper = function($sidebar, $outerWrapper, $overallWrapper, condition) {
        if (condition == "init") {
            if (settings.fixedBurger && settings.fixedSidebar) {
                this.offsetWrappers($outerWrapper, $overallWrapper, 'reset-fixed');
                this.locateOuterWrapper($sidebar, $outerWrapper);
                $outerWrapper.css({'position':'fixed'});
            }
            if (settings.fixedBurger) {
                this.offsetWrappers($outerWrapper, $overallWrapper, 'reset-fixed');
                this.locateOuterWrapper($sidebar, $outerWrapper);
                $outerWrapper.css({'position':'fixed'});
            } else {
                this.offsetWrappers($outerWrapper, $overallWrapper, 'reset-relative');
                this.locateOuterWrapper($sidebar, $outerWrapper);
                $outerWrapper.css({'position':'relative'});   
            }
        }
        if (condition == 'slideOut') {
            if (settings.fixedBurger && settings.fixedSidebar) {
                this.offsetWrappers($outerWrapper, $overallWrapper, 'fixed');
                this.locateOuterWrapper($sidebar, $outerWrapper);
                $outerWrapper.css({'position':'fixed'});
                this.setOpenMenuStatus(true);
            }
            if (settings.fixedBurger && !settings.fixedSidebar) {
                this.offsetWrappers($outerWrapper, $overallWrapper, 'relative');
                this.locateOuterWrapper($sidebar, $outerWrapper);
                $outerWrapper.css({'position':'relative'});
                this.setOpenMenuStatus(true);
            }
            if (!settings.fixedBurger && settings.fixedSidebar) {
                this.offsetWrappers($outerWrapper, $overallWrapper, 'fixed');
                this.locateOuterWrapper($sidebar, $outerWrapper);
                $outerWrapper.css({'position':'fixed'});
                this.setOpenMenuStatus(true);
            }
        }
        if (condition == 'slideIn') {
            if (settings.fixedBurger && settings.fixedSidebar) {
                this.offsetWrappers($outerWrapper, $overallWrapper, 'fixed');
                this.locateOuterWrapper($sidebar, $outerWrapper);
                $outerWrapper.css({'position':'fixed'});
                this.setOpenMenuStatus(false);
            }
            if (settings.fixedBurger && !settings.fixedSidebar) {
                this.offsetWrappers($outerWrapper, $overallWrapper, 'fixed');
                this.locateOuterWrapper($sidebar, $outerWrapper);
                $outerWrapper.css({'position':'fixed'});
                this.setOpenMenuStatus(false);
            }
            if (!settings.fixedBurger && settings.fixedSidebar) {
                this.offsetWrappers($outerWrapper, $overallWrapper, 'relative');
                this.locateOuterWrapper($sidebar, $outerWrapper);
                $outerWrapper.css({'position':'relative'});
                this.setOpenMenuStatus(false);
            }
        }
    }

    //locateOuterWrapper sets the outerWrapper at its location determined by the previous three functions
    MobileMenu.prototype.locateOuterWrapper = function($sidebar, $outerWrapper) {
        var _sidebarLocation = settings.sidebarLocation;

        if (_sidebarLocation === "right" && this.getOpenMenuStatus()) {
            //right and open
            $outerWrapper.css({top: settings.moveOuterWrapperY+this.getOuterWrapperLocation().ytop});

            } else if (_sidebarLocation === "right") {
                //right and close               
                $outerWrapper.css({right:-$sidebar.width()+settings.moveOuterWrapperX, top: settings.moveOuterWrapperY+this.getOuterWrapperLocation().ytop});
            } 

        if (_sidebarLocation === "left" && this.getOpenMenuStatus()) {
            //left and open
            $outerWrapper.css({top: settings.moveOuterWrapperY+this.getOuterWrapperLocation().ytop});
            
            } else if (_sidebarLocation === "left") {
                //left and close
                $outerWrapper.css({left:-$sidebar.width()+settings.moveOuterWrapperX, top: settings.moveOuterWrapperY+this.getOuterWrapperLocation().ytop});
            }
    }

     //positions burger at edge of screeen by adding and subtracting all of the margins and paddings of the overallWrapper's parent elements
    MobileMenu.prototype.overallWrapperPMLeftAndPMRight = function($overallWrapper) {

        var sumLeft = 0;
        var sumRight = 0;
        var pl = 0;
        var ml = 0;
        var pr = 0;
        var mr = 0;

        $overallWrapper.parents().map(function() {
            var el = $(this);

            var mLeft = el.css('margin-left');
            var mRight = el.css('margin-right');
            el.css('margin-left', (parseInt(mLeft)-2) + 'px');
            var mRightChanged = el.css('margin-right');
    
            if (mRight == mRightChanged) {
                //mr and ml are not auto
                el.css('margin-left', mLeft);
                pl = $(this).css('padding-left').replace(/[^\d.-]/g, '');
                ml = $(this).css('margin-left').replace(/[^\d.-]/g, '');
                pr = $(this).css('padding-right').replace(/[^\d.-]/g, '');
                mr = $(this).css('margin-right').replace(/[^\d.-]/g, '');
                sumLeft += parseInt(pl, 10) + parseInt(ml, 10);
                sumRight += parseInt(pr, 10) + parseInt(mr, 10);
            }           
        });

        $overallWrapper.css({'margin-left': -(sumLeft)});
        $overallWrapper.css({'margin-right': -(sumRight)});
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
    MobileMenu.prototype.configDisplay = function($burger, $sidebar, $innerWrapper, $outerWrapper, $overallWrapper, $overlay) {
        if (this.isMobile() && this.getOpenMenuStatus()) {
            $sidebar.show();
            $this.hide();
            $overallWrapper.show();
            
            } else if (this.isMobile()) {
                $sidebar.hide(); 
                $this.hide();
                $burger.show();
                $overallWrapper.show();
    
                //check to see if screen has just gone from desktop to mobile
                if (this.getCheckIfJustChangedToMobile()) {
                    this.setPositionPropertyOuterWrapper($sidebar, $outerWrapper, $overallWrapper, 'init');
                    this.setCheckIfJustChangedToMobile(false);
                }
            
            } else if (this.getOpenMenuStatus()) {
                $sidebar.hide();
                $this.show();
                $burger.hide();
                $overallWrapper.hide();

                //Note: with the menu open before going to desktop view, 'slideIn' must be run on the innerWrapper
                this.slideIn($burger, $sidebar, $innerWrapper, $outerWrapper, $overallWrapper);

                this.setCheckIfJustChangedToMobile(true);
                this.setOpenMenuStatus(false);
                $overlay.removeClass(settings.activeOverlayClass);
           
           } else {
                $sidebar.hide();
                $this.show();
                $burger.hide();
                $overallWrapper.hide();
                this.setCheckIfJustChangedToMobile(true);       
            }
    }

    /* ---------------------------------------------
        Animate
       --------------------------------------------- */
    MobileMenu.prototype.resizeWindow = function($burger, $sidebar, $innerWrapper, $outerWrapper, $overallWrapper, $overlay) {
        var _this = this;

        $(window).resize(function() {
            _this.offsetChangeFromResizeWindow($overallWrapper);
            _this.offsetWrappers($outerWrapper, $overallWrapper, 'relative');

            //change outerWrapper to relative (if not already)
            $outerWrapper.css({'position':'relative'});
            _this.locateOuterWrapper($sidebar, $outerWrapper);
            _this.configDisplay($burger, $sidebar, $innerWrapper, $outerWrapper, $overallWrapper, $overlay);

            if (settings.sidebarLocation == 'right') {
                $overallWrapper.css({
                    'left':$(window).width()
                })
            }
            
            //this if statement interacts with scrollWindow function
            if (_this.getResize()) {
                _this.setResize(false);
                _this.setScroll(true); 
            }   
        });
    }

    MobileMenu.prototype.scrollWindow = function($sidebar, $outerWrapper, $overallWrapper) {
        var _this = this;

        $(window).scroll(function() {
            //if statement is true, just after window is resized, when the outerWrapper position is 'relative'
                //so when scrolling begins, in such a situation, the appropriate outWrapper position needs to 
                //be set depending on whether the OpenMenuStatus is true or false
            if (_this.getScroll()) {
                if (_this.getOpenMenuStatus()) {
                    _this.setPositionPropertyOuterWrapper($sidebar, $outerWrapper, $overallWrapper, 'slideOut');
                }
                else {
                    _this.setPositionPropertyOuterWrapper($sidebar, $outerWrapper, $overallWrapper, 'slideIn');
                }
                _this.setScroll(false);
                _this.setResize(true);
            }
        });
    }

    MobileMenu.prototype.animate = function($burger, $sidebar, $innerWrapper, $outerWrapper, $overallWrapper, $overlay) {
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
                _this.slideOut($burger, $sidebar, $innerWrapper, $outerWrapper, $overallWrapper);
            } else {
                _this.slideIn($burger, $sidebar, $innerWrapper, $outerWrapper, $overallWrapper);
                _this.visibleBurger($burger);
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
             _this.slideIn($burger, $sidebar, $innerWrapper, $outerWrapper);
             _this.visibleBurger($burger);

            //switch the menu status
            _this.setOpenMenuStatus(!(_this.getOpenMenuStatus()));

            //remove activeOverlay
            $overlay.removeClass(_activeOverlay);
       });   
    }

    MobileMenu.prototype.slideIn = function($burger, $sidebar, $innerWrapper, $outerWrapper, $overallWrapper) {
        var _this = this;
        var _burgerVisible = settings.burgerVisible;

        $innerWrapper.animate(_this.updateWrapperPosition(), settings.slideDuration, function() {
            _this.setPositionPropertyOuterWrapper($sidebar, $outerWrapper, $overallWrapper, 'slideIn');
        });
    }

    MobileMenu.prototype.slideOut = function($burger, $sidebar, $innerWrapper, $outerWrapper, $overallWrapper) {
        var _this = this;
 
        $innerWrapper.animate(_this.updateWrapperPosition(), settings.slideDuration, function() {
            _this.setPositionPropertyOuterWrapper($sidebar, $outerWrapper, $overallWrapper, 'slideOut'); 
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
