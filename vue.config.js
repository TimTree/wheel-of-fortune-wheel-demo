module.exports = {
  css: {
    loaderOptions: {
      scss: {
        prependData: '@import "@/assets/variables.scss";',
      },
    },
  },
};
