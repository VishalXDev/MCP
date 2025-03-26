const { getDefaultConfig } = require("expo/metro-config");

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  config.resolver = {
    ...config.resolver,
    sourceExts: [...config.resolver.sourceExts, "env"], // ✅ Ensure .env is recognized
  };

  return config;
})();
