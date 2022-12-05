const validate_css = require("./validate");

/**
 * @param {string} css
 */
const assert_invalid = (css) => {
  const { serialized, errors } = validate_css(css);

  expect(errors).not.toHaveLength(0);
};

it("should fail for offsite url", () => {
  const css = "* { background-image: url('http://foobar/'); }";
  assert_invalid(css);
});

it("should fail for nested url", () => {
  const css = '* { background-image: calc(url("http://foobar/")); }';
  assert_invalid(css);
});

it("should fail for url prelude", () => {
  const css = "*[foo=url('http://foobar/')]{color:red;}";
  assert_invalid(css);
});

it("should fail for invalid property", () => {
  const css = "* { foo: red; }";
  assert_invalid(css);
});

it("should fail for import", () => {
  const css = "@import 'foobar'; *{}";
  assert_invalid(css);
});

it("should fail for import rule", () => {
  const css = "*{ @import 'foobar'; }";
  assert_invalid(css);
});
