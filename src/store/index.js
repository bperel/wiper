import Vue from "vue";
import Vuex from "vuex";
import tiles from "./modules/tiles";
import skippedRules from "./modules/skippedRules";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    LANGUAGETOOL_ENDPOINT_ROOT: process.env.VUE_APP_LANGUAGETOOL_ENDPOINT_ROOT,
    supportedLanguages: {
      ca: "Català",
      de: "Deutsch",
      fr: "Français",
      nl: "Nederlands",
      pl: "Polski",
      pt: "Português",
      ru: "Русский",
      uk: "Українська",
    },
    accessTokens: null,
  },
  mutations: {
    initAccessTokens(state) {
      state.accessTokens = [];
    },
    addAccessToken(state, { languageCode, username, accessToken }) {
      state.accessTokens.push({ languageCode, accessToken, username });
    },
  },
  getters: {
    languageWithAccessToken: (state) =>
      state.accessTokens.map(
        (accessToken) =>
          `${accessToken.languageCode}=${accessToken.accessToken}`
      ),
  },
  actions: {},
  modules: {
    tiles,
    skippedRules,
  },
});
