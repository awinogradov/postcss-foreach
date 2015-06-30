var postcss = require('postcss');
var vars    = require('postcss-simple-vars');
var list    = postcss.list;

function checkParams(rule) {
  if (rule.params.indexOf('in') == -1) {
    throw rule.error('Missed "in" keyword in @foreach');
  }

  var params = rule.params.split('in');
  var name = params[0].trim();
  var values = params[1].trim();

  if (!name.match(/\$[_a-zA-Z]?\w+/)) {
    throw rule.error('Missed variable name in @foreach');
  }

  if (!values.match(/(\w+\,?\s?)+/)) {
    throw rule.error('Missed values list in @foreach');
  }
}

function paramsList(params) {
  var params = params.split('in');
  var vars = params[0].split(',');

  console.log(params);
  console.log(vars);

  return {
    name: vars[0].replace('$', '').trim(),
    increment: vars[1] && vars[1].replace('$', '').trim(),
    values: list.comma(params[1])
  };
}

function processRules(rule, params) {
  var values = {};

  rule.nodes.forEach(function(node) {
    params.values.forEach(function(value, i) {
      var clone = node.clone();
      var proxy = postcss.rule({ nodes: [clone] });

      values[params.name] = value;
      params.increment && (values[params.increment] = i);

      vars({ only: values })(proxy);

      rule.parent.insertBefore(rule, clone);
    });

    node.removeSelf();
  });
}

module.exports = postcss.plugin('postcss-foreach', function(opts) {
  opts = opts || {};

  return function(css) {
    css.eachAtRule('foreach', function(rule) {
      checkParams(rule);
      var params = paramsList(rule.params);
      processRules(rule, params);
      rule.removeSelf();
    });
  };

});
