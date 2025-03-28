const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function(env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      mode: 'production',
    },
    argv
  );
  
  // Customize the config before returning it.
  return config;
}; 