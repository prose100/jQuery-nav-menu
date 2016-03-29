# jQuery-Nav-Menu Plugin

The jQuery-Nav-Menu Plugin provides a slide-in navigation menu during a mobile state.

## Getting Started

[Downloading](https://github.com/prose100/jQuery-nav-menu/zipball/master) or Forking this repository

### Including it on your page

Here is a basic implementation. Include the shown link, HTML, and scripts.  Call the function as shown.
The properties shown are the defaults.

```html
<link href="css/nav-menu.css" rel="stylesheet">

<ul class="nav-menu">
    <li><a href="#">Home</a></li>
    <li><a href="#">About</a></li>
    <li><a href="#">Contact</a></li>
</ul>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
<script src="js/nav-menu.js"></script>
<script>
$(function() {
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
        burgerSpacing: 4,
        burgerColor: "#777",
        burgerClass: 'burger',
        sidebarClass: 'sidebar'
    });
});
</script>
```
 
## Getting more details

Visit [paultrose.com](http://www.paultrose.com/blogJan16.html) for more details about this plugin.