import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    versionNumber: '0.1',
    isTitleSlide: true,
    packageVersion: process.env.PACKAGE_VERSION || '0',
  },
  getters: {
    appVersion: (state) => {
      if (state.packageVersion.split('.')[2] === '0') {
        return `${state.packageVersion.split('.')[0]}.${state.packageVersion.split('.')[1]}`;
      } return state.packageVersion;
    },
  },
  mutations: {
    isTitleSlide(state, n) {
      state.isTitleSlide = n;
    },
  },
  actions: {
  },
  modules: {
  },
});
