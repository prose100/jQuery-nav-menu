# jQuery-nav-menu Plugin

This plugin provides a slide-in navigation menu during a mobile state.

## Overview

## Getting Started

[Downloading](https://github.com/prose100/jQuery-nav-menu/zipball/master) or Forking this repository

### Including it on your page

Include jQuery and the plugin on a page.  Call the function as shown.

```html
<ul class="nav-menu" style="display:none">
        <li><a href="#">Home</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Contact</a></li>
</ul>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
<script src="js/nav-menu.js"></script>
<script>
$(function() {
    $(".nav-menu").mobilemenu({
      	windowWidth: 900,
        slideDuration: 500,
        sidebarLocation: 'right',
        slideDistance: 60,
        moveBurgerX: 0,
        moveBurgerY: 0,
        moveSidebarX: 0,
        moveSidebarY: 0,
        burgerClass: 'burger',
        sidebarClass: 'sidebar',
        wrapperClass: 'wrapper'
    });
});
</script>
```
 
