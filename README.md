#[jQuery-Nav-Menu Plugin](http://www.paultrose.com/blogJan16.html)

The jQuery-Nav-Menu Plugin provides a slide-in navigation menu during a mobile state.

## Getting Started

[Downloading](https://github.com/prose100/jQuery-nav-menu/zipball/master) or Forking this repository

## Usage Instructions

####Include the CSS & JS
nav-menu.css can be modified to fit a website design

    <link href="css/nav-menu.css">
    <script src="js/nav-menu.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/
                 jquery/2.1.4/jquery.min.js"></script>

####Menu Markup

    <ul class="nav-menu">
        <li><a href="#">Home</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Contact</a></li>
    </ul>

####Initialize

    <script>
        $(function() {
            $(".nav-menu").mobilemenu({});
        });
    </script>

## Default `options`

There are some customizable options in this plugin using key : value pairs. These are the defaults. 
Visit [jQuery-Nav-Menu Plugin](http://www.paultrose.com/blogJan16.html) for description of these properties.

```
$(".nav-menu").mobilemenu({
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
    burgerSpanSpacing: 4,
    burgerColor: '#777',
    burgerVisible: false,
    fixedBurger: false,
    fixedSidebar: false,
    burgerClass: 'burger',
    sidebarClass: 'sidebar',
    activeOverlayClass: 'activeOverlay'
});

```
 
## See some examples

Visit [jQuery-Nav-Menu Plugin](http://www.paultrose.com/blogJan16.html) for more details about this plugin.