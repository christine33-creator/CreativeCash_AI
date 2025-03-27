const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function(env, argv) {
  // Make sure env has the correct structure
  const envWithDefaults = {
    ...env,
    mode: env.mode || 'development'
  };
  
  const config = await createExpoWebpackConfigAsync(
    envWithDefaults,
    argv
  );
  
  // Add any custom configurations here
  
  return config;
}; 