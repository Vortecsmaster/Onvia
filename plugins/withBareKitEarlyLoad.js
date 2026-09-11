const { withMainApplication } = require("@expo/config-plugins");

/**
 * libappmodules.so DT_NEEDED includes libbare-kit.so (~62 MB).
 * If SoLoader cannot load that dependency while registering TurboModules,
 * RN bootstrap dies with PlatformConstants missing. Load it first.
 */
function withBareKitEarlyLoad(config) {
  return withMainApplication(config, (mod) => {
    if (mod.modResults.language !== "kt") return mod;
    let src = mod.modResults.contents;
    if (src.includes('System.loadLibrary("bare-kit")')) return mod;
    if (!src.includes("android.util.Log")) {
      src = src.replace(
        "import android.app.Application\n",
        "import android.app.Application\nimport android.util.Log\n",
      );
    }
    const needle = "    loadReactNative(this)";
    if (!src.includes(needle)) {
      throw new Error("MainApplication.kt: loadReactNative(this) not found");
    }
    src = src.replace(
      needle,
      `    try {
      System.loadLibrary("bare-kit")
    } catch (error: UnsatisfiedLinkError) {
      Log.e("ONVIA", "libbare-kit.so failed to load", error)
    }
    loadReactNative(this)`,
    );
    mod.modResults.contents = src;
    return mod;
  });
}

module.exports = withBareKitEarlyLoad;
