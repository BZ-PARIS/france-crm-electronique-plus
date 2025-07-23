const { ModuleFederationPlugin } = require('webpack').container;
module.exports = {
  mode: 'production',
  entry: './src/main.tsx',
  plugins: [
    new ModuleFederationPlugin({
      name: 'core',
      remotes: {
        analytics: 'analytics@/remoteEntry.js',
      },
    }),
  ],
};
