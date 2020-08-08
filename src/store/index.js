import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    LANGUAGETOOL_ENDPOINT_ROOT: process.env.VUE_APP_LANGUAGETOOL_ENDPOINT_ROOT,
    accessTokens: null,
    mostSkippedRules: [],
  },
  mutations: {
    initAccessTokens(state) {
      state.accessTokens = [];
    },
    addAccessToken(state, { languageCode, username, accessToken }) {
      state.accessTokens.push({ languageCode, accessToken, username });
    },
    setMostSkippedRules(state, mostSkippedRules) {
      state.mostSkippedRules = mostSkippedRules;
    },
  },
  getters: {
    mostSkippedRulesLanguageCodes: (state) => [
      ...new Set([
        ...state.mostSkippedRules.map(
          (skippedRule) => skippedRule.languageCode
        ),
      ]),
    ],
    languageWithAccessToken: (state) =>
      state.accessTokens.map(
        (accessToken) =>
          `${accessToken.languageCode}=${accessToken.accessToken}`
      ),
  },
  actions: {},
  modules: {},
});
