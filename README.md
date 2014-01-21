# position: sticky + JS fallback to CSS transforms.

## Markup proposed

```html
<div class="scrollable">
  <!--
  data-target it could be any ancestor, it's no need to be the direct one
  -->
  <div class="sticky" data-target=".scrollable">
    <!-- Fixed content will be here -->
  </div>
  <div class="content">
    <!-- Content bellow the fixed content -->
  </div>
</div>
```

## JS Snippet

```js
$('.sticky').fixedcolumn(); // this will handle all the JS show for you
```

## Browser support

  - IE11- use the fallback
  - Firefox till 28 or 29 use the fallback (the nighly for 28 runs native)
  - Chrome 31 use the fallback (I didn't activate the support manually)
  - Safari 6.1+ for OSX runs native
  - iOS Safari >= Version/7.0 runs native (Safari = Version/6.0 is buggy)

## Change log

  - 0.0.1 
    - CSS position: sticky
    - JS fallback to CSS transform (CSS postion:static & transform: translate)
    - JS requestAnimationFrame for smooth animation