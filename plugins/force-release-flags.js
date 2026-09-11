const fs = require("node:fs");
const path = require("node:path");

const file = path.join(__dirname, "..", "android", "gradle.properties");
let text = fs.readFileSync(file, "utf8");
for (const [key, value] of [
  ["android.enableMinifyInReleaseBuilds", "false"],
  ["android.enableShrinkResourcesInReleaseBuilds", "false"],
  ["expo.useLegacyPackaging", "true"],
]) {
  const line = `${key}=${value}`;
  text = text.includes(`${key}=`)
    ? text.replace(new RegExp(`${key.replace(/\./g, "\\.")}=.*`), line)
    : `${text.trim()}\n${line}\n`;
}
fs.writeFileSync(file, text);
console.log("forced release flags:", {
  minify: /android.enableMinifyInReleaseBuilds=(.*)/.exec(text)?.[1],
  shrink: /android.enableShrinkResourcesInReleaseBuilds=(.*)/.exec(text)?.[1],
  legacy: /expo.useLegacyPackaging=(.*)/.exec(text)?.[1],
});
