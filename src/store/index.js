import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentLanguageCode: "fr",
    accessTokens: [],
    LANGUAGETOOL_ENDPOINT_ROOT: "http://localhost:8081/v2/wikipedia",
  },
  mutations: {
    addAccessToken(state, { languageCode, username, accessToken }) {
      state.accessTokens.push({ languageCode, accessToken, username });
    },
  },
  actions: {},
  modules: {},
});
