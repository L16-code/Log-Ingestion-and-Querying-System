module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Disable TypeScript type checking to reduce memory usage during development
      const tsLoader = webpackConfig.module.rules.find(
        (rule) => rule.oneOf
      );
      
      if (tsLoader) {
        const tsRule = tsLoader.oneOf.find(
          (rule) => rule.loader && rule.loader.includes('ts-loader')
        );
        
        if (tsRule) {
          tsRule.options = {
            ...tsRule.options,
            transpileOnly: true, // Set to true to skip type checking
            experimentalWatchApi: true, // Enable experimental watch API for better performance
          };
        }
      }

      // Disable fork-ts-checker-webpack-plugin to save memory
      webpackConfig.plugins = webpackConfig.plugins.filter(
        (plugin) => plugin.constructor.name !== 'ForkTsCheckerWebpackPlugin'
      );

      return webpackConfig;
    },
  },
};
