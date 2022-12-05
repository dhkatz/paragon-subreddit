const css = require("css-tree");

const N_ = (s) => s;

const SIMPLE_TOKEN_TYPES = [
  "dimension",
  "hash",
  "ident",
  "literal",
  "number",
  "percentage",
  "string",
  "whitespace",
];

const VENDOR_PREFIXES = [
  "-apple-",
  "-khtml-",
  "-moz-",
  "-ms-",
  "-o-",
  "-webkit-",
];

console.assert(
  VENDOR_PREFIXES.every((prefix) => prefix === prefix.toLowerCase())
);

const SAFE_PROPERTIES = [
  "align-content",
  "align-items",
  "align-self",
  "animation",
  "animation-delay",
  "animation-direction",
  "animation-duration",
  "animation-fill-mode",
  "animation-iteration-count",
  "animation-name",
  "animation-play-state",
  "animation-timing-function",
  "appearance",
  "backface-visibility",
  "background",
  "background-attachment",
  "background-blend-mode",
  "background-clip",
  "background-color",
  "background-image",
  "background-origin",
  "background-position",
  "background-position-x",
  "background-position-y",
  "background-repeat",
  "background-size",
  "border",
  "border-bottom",
  "border-bottom-color",
  "border-bottom-left-radius",
  "border-bottom-right-radius",
  "border-bottom-style",
  "border-bottom-width",
  "border-collapse",
  "border-color",
  "border-image",
  "border-image-outset",
  "border-image-repeat",
  "border-image-slice",
  "border-image-source",
  "border-image-width",
  "border-left",
  "border-left-color",
  "border-left-style",
  "border-left-width",
  "border-radius",
  "border-radius-bottomleft",
  "border-radius-bottomright",
  "border-radius-topleft",
  "border-radius-topright",
  "border-right",
  "border-right-color",
  "border-right-style",
  "border-right-width",
  "border-spacing",
  "border-style",
  "border-top",
  "border-top-color",
  "border-top-left-radius",
  "border-top-right-radius",
  "border-top-style",
  "border-top-width",
  "border-width",
  "bottom",
  "box-shadow",
  "box-sizing",
  "caption-side",
  "clear",
  "clip",
  "clip-path",
  "color",
  "content",
  "counter-increment",
  "counter-reset",
  "cue",
  "cue-after",
  "cue-before",
  "cursor",
  "direction",
  "display",
  "elevation",
  "empty-cells",
  // the "filter" property cannot be safely added while IE9 is allowed to
  // use subreddit stylesheets. see explanation here:
  // https://github.com/reddit/reddit/pull/1058#issuecomment-76466180
  // "filter",
  "flex",
  "flex-align",
  "flex-basis",
  "flex-direction",
  "flex-flow",
  "flex-grow",
  "flex-item-align",
  "flex-line-pack",
  "flex-order",
  "flex-pack",
  "flex-shrink",
  "flex-wrap",
  "float",
  "font",
  "font-family",
  "font-size",
  "font-style",
  "font-variant",
  "font-weight",
  "grid",
  "grid-area",
  "grid-auto-columns",
  "grid-auto-flow",
  "grid-auto-position",
  "grid-auto-rows",
  "grid-column",
  "grid-column-start",
  "grid-column-end",
  "grid-row",
  "grid-row-start",
  "grid-row-end",
  "grid-template",
  "grid-template-areas",
  "grid-template-rows",
  "grid-template-columns",
  "hanging-punctuation",
  "height",
  "hyphens",
  "image-orientation",
  "image-rendering",
  "image-resolution",
  "justify-content",
  "left",
  "letter-spacing",
  "line-break",
  "line-height",
  "list-style",
  "list-style-image",
  "list-style-position",
  "list-style-type",
  "margin",
  "margin-bottom",
  "margin-left",
  "margin-right",
  "margin-top",
  "max-height",
  "max-width",
  "mask",
  "mask-border",
  "mask-border-mode",
  "mask-border-outset",
  "mask-border-repeat",
  "mask-border-source",
  "mask-border-slice",
  "mask-border-width",
  "mask-clip",
  "mask-composite",
  "mask-image",
  "mask-mode",
  "mask-origin",
  "mask-position",
  "mask-repeat",
  "mask-size",
  "min-height",
  "min-width",
  "mix-blend-mode",
  "opacity",
  "order",
  "orphans",
  "outline",
  "outline-color",
  "outline-offset",
  "outline-style",
  "outline-width",
  "overflow",
  "overflow-wrap",
  "overflow-x",
  "overflow-y",
  "padding",
  "padding-bottom",
  "padding-left",
  "padding-right",
  "padding-top",
  "page-break-after",
  "page-break-before",
  "page-break-inside",
  "pause",
  "pause-after",
  "pause-before",
  "perspective",
  "perspective-origin",
  "pitch",
  "pitch-range",
  "play-during",
  "pointer-events",
  "position",
  "quotes",
  "resize",
  "richness",
  "right",
  "speak",
  "speak-header",
  "speak-numeral",
  "speak-punctuation",
  "speech-rate",
  "stress",
  "table-layout",
  "tab-size",
  "text-align",
  "text-align-last",
  "text-decoration",
  "text-decoration-color",
  "text-decoration-line",
  "text-decoration-skip",
  "text-decoration-style",
  "text-indent",
  "text-justify",
  "text-overflow",
  "text-rendering",
  "text-shadow",
  "text-size-adjust",
  "text-space-collapse",
  "text-transform",
  "text-underline-position",
  "text-wrap",
  "top",
  "transform",
  "transform-origin",
  "transform-style",
  "transition",
  "transition-delay",
  "transition-duration",
  "transition-property",
  "transition-timing-function",
  "unicode-bidi",
  "vertical-align",
  "visibility",
  "voice-family",
  "volume",
  "white-space",
  "widows",
  "width",
  "will-change",
  "word-break",
  "word-spacing",
  "z-index",
];

console.assert(SAFE_PROPERTIES.every((p) => p === p.toLowerCase()));

const SAFE_FUNCTIONS = [
  "attr",
  "calc",
  "circle",
  "counter",
  "counters",
  "cubic-bezier",
  "ellipse",
  "hsl",
  "hsla",
  "lang",
  "line",
  "linear-gradient",
  "matrix",
  "matrix3d",
  "not",
  "nth-child",
  "nth-last-child",
  "nth-last-of-type",
  "nth-of-type",
  "perspective",
  "polygon",
  "polyline",
  "radial-gradient",
  "rect",
  "repeating-linear-gradient",
  "repeating-radial-gradient",
  "rgb",
  "rgba",
  "rotate",
  "rotate3d",
  "rotatex",
  "rotatey",
  "rotatez",
  "scale",
  "scale3d",
  "scalex",
  "scaley",
  "scalez",
  "skewx",
  "skewy",
  "steps",
  "translate",
  "translate3d",
  "translatex",
  "translatey",
  "translatez",
];

console.assert(SAFE_FUNCTIONS.every((f) => f === f.toLowerCase()));

/**
 * @constant
 */
const ERROR_MESSAGES = {
  IMAGE_NOT_FOUND: N_('no image found with name "%(name)s"'),
  NON_PLACEHOLDER_URL: N_(
    "only uploaded images are allowed; reference them with the %%%%imagename%%%% system"
  ),
  SYNTAX_ERROR: N_("syntax error: %(message)s"),
  UNKNOWN_AT_RULE: N_("@%(keyword)s is not allowed"),
  UNKNOWN_PROPERTY: N_('unknown property "%(name)s"'),
  UNKNOWN_FUNCTION: N_('unknown function "%(function)s"'),
  UNEXPECTED_TOKEN: N_('unexpected token "%(token)s"'),
  BACKSLASH: N_("backslashes are not allowed"),
  CONTROL_CHARACTER: N_("control characters are not allowed"),
  TOO_BIG: N_("the stylesheet is too big. maximum size: %(size)d KiB"),
};

const MAX_SIZE_KIB = 100;
const SUBREDDIT_IMAGE_URL_PLACEHOLDER = /^%%([a-zA-Z0-9\-]+)%%$/;

/**
 * @param {string} identifier
 * @returns {string}
 */
function strip_vendor_prefix(identifier) {
  for (const prefix of VENDOR_PREFIXES) {
    if (identifier.startsWith(prefix)) {
      return identifier.slice(prefix.length);
    }
  }

  return identifier;
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
  }
}

class StylesheetValidator {
  constructor(skip_images) {
    this.skip_images = skip_images;
  }

  /**
   * Validates that a CSS url contains only a valid image in the %name% format.
   */
  validate_url(url_node) {
    if (this.skip_images) return;

    const match = url_node.value.match(SUBREDDIT_IMAGE_URL_PLACEHOLDER);
    if (!match) {
      return new ValidationError(ERROR_MESSAGES.NON_PLACEHOLDER_URL);
    }

    // We don't need to check if the image exists here, because we
    // handle images in the build and publish steps.
    // const name = match[1];
    // if (!this.images.has(name)) {
    //   return new ValidationError(ERROR_MESSAGES.IMAGE_NOT_FOUND, { name });
    // }
  }

  validate_function(function_node) {}

  validate_declaration(declaration_node) {
    const property = strip_vendor_prefix(
      declaration_node.property.toLowerCase()
    );
    if (!SAFE_PROPERTIES.includes(property)) {
      return new ValidationError(ERROR_MESSAGES.UNKNOWN_PROPERTY, {
        name: declaration_node.property,
      });
    }
  }

  validate_qualified_rule() {}

  validate_atrule(atrule_node) {
    const keyword = strip_vendor_prefix(atrule_node.name.toLowerCase());

    if (["media", "keyframes"].includes(keyword)) {
      // TODO: validate media queries
    } else if (keyword === "page") {
      // TODO: Validate qualified rules
    } else {
      return new ValidationError(ERROR_MESSAGES.UNKNOWN_AT_RULE, {
        keyword: atrule_node.name,
      });
    }
  }

  validate_rule_list(rules) {
    return this.validate_list(rules, {});
  }

  validate_list(nodes, validators_by_type, ignored_types = null) {
    const errors = [];

    css.walk(nodes, (node) => {
      const type = node.type.toLowerCase();
      if (type === "raw") {
        errors.push(
          new ValidationError(ERROR_MESSAGES.SYNTAX_ERROR, {
            value: node.value,
          })
        );
      } else if (typeof this[`validate_${type}`] === "function") {
        const error = this[`validate_${type}`](node);
        if (error) {
          errors.push(error);
        }
      }
    });

    return errors;
  }

  /**
   *
   * @param {string[]} source_Lines
   * @returns {ValidationError[]}
   */
  check_for_evil_codepoints(source_Lines) {
    const errors = [];

    for (const [line, text] of source_Lines.entries()) {
      for (const codepoint of text) {
        // IE<8: *{color: expression\28 alert\28 1 \29 \29 }
        if (codepoint === "\\") {
          errors.push(new ValidationError(ERROR_MESSAGES.BACKSLASH, { line }));
          break;
          // accept these characters that get classified as control
        } else if (["\t", "\n", "\r"].includes(codepoint)) {
          continue;
          // Safari: *{font-family:'foobar\x03;background:url(evil);';}
        } else if (codepoint <= "\u001F" || codepoint === "\u007F") {
          errors.push(
            new ValidationError(ERROR_MESSAGES.CONTROL_CHARACTER, { line })
          );
          break;
        }
      }
    }

    return errors;
  }

  /**
   *
   * @param {string} stylesheet
   * @returns {{serialized: string, errors: ValidationError[]}}
   */
  parse_and_validate(stylesheet) {
    if (stylesheet.length > MAX_SIZE_KIB * 1024) {
      throw new ValidationError(ERROR_MESSAGES.TOO_BIG, { size: MAX_SIZE_KIB });
    }

    const ast = css.parse(stylesheet, {});

    const backslash_errors = this.check_for_evil_codepoints(
      stylesheet.split("\n")
    );
    const validation_errors = this.validate_rule_list(ast);

    const errors = [...backslash_errors, ...validation_errors];

    return {
      serialized: "",
      errors,
    };
  }
}

/**
 *
 * @param {string} stylesheet
 * @param {boolean} skip_images
 * @returns {{serialized: string, errors: ValidationError[]}}
 */

function validate_css(stylesheet, skip_images = false) {
  const validator = new StylesheetValidator(skip_images);

  return validator.parse_and_validate(stylesheet);
}

// validate_css("@import 'foobar'; *{}");

module.exports = validate_css;
