module.exports = {
  extends: [
    'stylelint-config-rational-order', // CSS property order stylelint configuration package
    'stylelint-stylus/standard' // Stylus stylelint standard configuration package
  ],
  rules: {
    'stylus/pythonic': 'never', // Stylus keep braces ({}) on the same line
    'stylus/no-eol-whitespace': null
  }
}