const { withDangerousMod, withGradleProperties } = require("@expo/config-plugins");
const fs = require("node:fs");
const path = require("node:path");

function setProp(properties, key, value) {
  const index = properties.findIndex(
    (item) => item.type === "property" && item.key === key,
  );
  if (index >= 0) properties[index].value = value;
  else properties.push({ type: "property", key, value });
}

function withOnviaAndroidRelease(config) {
  config = withGradleProperties(config, (mod) => {
    setProp(mod.modResults, "android.enableMinifyInReleaseBuilds", "false");
    setProp(
      mod.modResults,
      "android.enableShrinkResourcesInReleaseBuilds",
      "false",
    );
    setProp(mod.modResults, "expo.useLegacyPackaging", "true");
    return mod;
  });
  return withDangerousMod(config, [
    "android",
    async (mod) => {
      const extra = fs.readFileSync(
        path.join(mod.modRequest.projectRoot, "proguard-keep.pro"),
        "utf8",
      );
      const rules = path.join(
        mod.modRequest.platformProjectRoot,
        "app/proguard-rules.pro",
      );
      const current = fs.existsSync(rules) ? fs.readFileSync(rules, "utf8") : "";
      if (!current.includes("to.holepunch")) {
        fs.writeFileSync(rules, `${current.trim()}\n\n${extra.trim()}\n`);
      }
      const gradle = path.join(
        mod.modRequest.platformProjectRoot,
        "gradle.properties",
      );
      let text = fs.readFileSync(gradle, "utf8");
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
      fs.writeFileSync(gradle, text);
      return mod;
    },
  ]);
}

module.exports = withOnviaAndroidRelease;
