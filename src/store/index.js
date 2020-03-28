import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentLanguageCode: "fr",
    accessTokens: [],
    LANGUAGETOOL_ENDPOINT_ROOT: process.env.VUE_APP_LANGUAGETOOL_ENDPOINT_ROOT,
  },
  mutations: {
    addAccessToken(state, { languageCode, username, accessToken }) {
      state.accessTokens.push({ languageCode, accessToken, username });
    },
  },
  actions: {},
  modules: {},
});
