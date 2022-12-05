const validate_css = require("./validate");

/**
 * @param {string} css
 */
const assert_invalid = (css) => {
  const { errors } = validate_css(css);

  expect(errors).not.toHaveLength(0);
};

test("offsite url", () => {
  const css = "* { background-image: url('http://foobar/'); }";
  assert_invalid(css);
});

test("nested url", () => {
  const css = '* { background-image: calc(url("http://foobar/")); }';
  assert_invalid(css);
});

test("url prelude", () => {
  const css = "*[foo=url('http://foobar/')]{color:red;}";
  assert_invalid(css);
});

test("invalid property", () => {
  const css = "* { foo: red; }";
  assert_invalid(css);
});

test("import", () => {
  const css = "@import 'foobar'; *{}";
  assert_invalid(css);
});

test("import rule", () => {
  const css = "*{ @import 'foobar'; }";
  assert_invalid(css);
});

// IE<8 XSS
test("invalid function", () => {
  const css = "*{color:expression(alert(1));}";
  assert_invalid(css);
});

test("invalid function prelude", () => {
  const css = "*[foo=expression(alert(1))]{color:red;}";
  assert_invalid(css);
});

// Safari 5.x parser resynchronization issues
test("semicolon function", () => {
  const css = "*{color: calc(;color:red;);}";
  assert_invalid(css);
});

test("semicolon block", () => {
  const css = "*{color: [;color:red;];}";
  assert_invalid(css);
});

// Safari 5.x prelude escape
test("escape prelude", () => {
  const css = "*[foo=bar{}*{color:blue}]{color:red;}";
  assert_invalid(css);
});

// Multi-browser url() escape via spaces inside quotes
test("escape url", () => {
  const css = "*{background-image: url('foo bar');}";
  assert_invalid(css);
});

// Control chars break out of quotes in multiple browsers
test("control chars", () => {
  const css = "*{font-family:'foobar\x03;color:red;';}";
  assert_invalid(css);
});

test("embedded nulls", () => {
  const css = "*{font-family:'foobar\x00;color:red;';}";
  assert_invalid(css);
});

// Firefox allows backslashes in function names
test("escaped url", () => {
  const css = "*{background-image:\\u\\r\\l('http://foobar/')}";
  assert_invalid(css);
});

// IE<8 allows backslash escapes in place of pretty much any char
test("escaped function obfuscation", () => {
  const css = "*{color: expression\\28 alert\\28 1 \\29 \\29 }";
  assert_invalid(css);
});

// This is purely speculative, and may never affect actual browsers
// https://developer.mozilla.org/en-US/docs/Web/CSS/attr
test("attr url", () => {
  const css = "*{background-image:attr(foobar url);}";
  assert_invalid(css);
});
