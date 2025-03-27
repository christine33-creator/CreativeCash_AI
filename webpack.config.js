const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function(env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      // Customize your webpack configuration here
    },
    argv
  );
  
  // Maybe you want to add some custom plugins or rules
  
  return config;
}; 