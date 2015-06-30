var postcss = require('postcss');
var assert  = require('assert');

var plugin = require('../');

function test(input, expected, opts, done) {
  var result = postcss([plugin(opts)]).process(input).css;
  assert.equal(result, expected);
};

describe('postcss-foreach', function() {

  it('expects valid syntax', function() {
    var missedIn = function() {
      test('@foreach $icon foo, bar {}');
    };

    var missedVar = function() {
      test('@foreach in foo, bar {}');
    };

    var missedValues = function() {
      test('@foreach $icon in {}');
    };

    assert.throws(missedIn, /Missed "in" keyword in @foreach/);
    assert.throws(missedVar, /Missed variable name in @foreach/);
    assert.throws(missedValues, /Missed values list in @foreach/);
  });

  it('iterates through given values', function() {
    var input     = '@foreach $icon in foo, bar { .icon-$(icon) {' +
                    'background: url("$(icon).png"); } }';
    var expected  = '.icon-foo {\n    background: url("foo.png")\n}\n' +
                    '.icon-bar {\n    background: url("bar.png")\n}';
    test(input, expected);
  });

  it('iterates through one value', function() {
    var input     = '@foreach $icon in foo { .icon-$(icon) {' +
                    'background: url("$(icon).png"); } }';
    var expected  = '.icon-foo {\n    background: url("foo.png")\n}';
    test(input, expected);
  });

  it('iterates short names', function() {
    var input     = '@foreach $i in foo { .icon-$(i) {' +
                    'background: url("$(i).png"); } }';
    var expected  = '.icon-foo {\n    background: url("foo.png")\n}';
    test(input, expected);
  });

  it('iterates vals and position', function() {
    var input     = '@foreach $val, $i in foo { .icon-$(val) {' +
                    'background: url("$(val)_$(i).png"); } }';
    var expected  = '.icon-foo {\n    background: url("foo_0.png")\n}';
    test(input, expected);
  });

  it('respects multiple selectors', function() {
    var input     = '@foreach $icon in foo, bar { .icon-$(icon), .$(icon)' +
                    '{ background: url("$(icon).png"); } }';
    var expected  = '.icon-foo, .foo {\n    background: url("foo.png")\n}\n' +
                    '.icon-bar, .bar {\n    background: url("bar.png")\n}';
    test(input, expected);
  });

  it('respects multiple properties', function() {
    var input     = '@foreach $icon in foo, bar { .icon-$(icon) {' +
                    'background: url("$(icon).png");' +
                    'content: "$(icon)";' +
                    '}}';
    var expected  = '.icon-foo {\n    background: url("foo.png");\n' +
                                 '    content: "foo"\n}\n' +
                    '.icon-bar {\n    background: url("bar.png");\n' +
                                 '    content: "bar"\n}';
    test(input, expected);
  });

  it('doesn\'t replace other variables', function() {
    var input     = '@foreach $icon in foo, bar { .icon-$(icon), .$(icon)' +
                    '{ background: url("$(bg).png"); } }';
    var expected  = '.icon-foo, .foo {\n    background: url("$(bg).png")\n}\n' +
                    '.icon-bar, .bar {\n    background: url("$(bg).png")\n}';
    test(input, expected);
  });

});
