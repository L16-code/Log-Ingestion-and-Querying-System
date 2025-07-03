module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Increase memory limit for TypeScript type checking
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
            transpileOnly: false,
            experimentalWatchApi: false,
          };
        }
      }

      // Increase memory limit for the type checker
      const forkTsChecker = webpackConfig.plugins.find(
        (plugin) => plugin.constructor.name === 'ForkTsCheckerWebpackPlugin'
      );
      
      if (forkTsChecker) {
        forkTsChecker.options.memoryLimit = 4096;
      }

      return webpackConfig;
    },
  },
};
