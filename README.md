# postcss-foreach [![Build Status][ci-img]][ci]

A [PostCSS] plugin to iterate through values.

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/verybigman/postcss-foreach.svg
[ci]:      https://travis-ci.org/verybigman/postcss-foreach

```css
$array: (foo, bar, baz);

@each $val, $i in s, m, l  {
  .icon_size_$(val) {
    background: url('icons/$(array[$i]).png');
  }
}
```

```css
.icon_size_s {
  background: url('icons/foo.png');
}

.icon_size_m {
  background: url('icons/bar.png');
}

.icon_size_l {
  background: url('icons/baz.png');
}
```

## Usage

```js
postcss([ require('postcss-foreach') ])
```

See [PostCSS] docs for examples for your environment.
