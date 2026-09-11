const { defineConfig } = require("eslint/config");
const expo = require("eslint-config-expo/flat");
module.exports = defineConfig([
  expo,
  {
    ignores: [
      "dist/**",
      "dist-native/**",
      "dist-final/**",
      ".expo/**",
      "android/**",
      "ios/**",
      "release/**",
      "__MACOSX/**",
      "plugins/**",
    ],
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "import/no-cycle": "error",
    },
  },
]);
