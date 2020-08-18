import Vue from "vue";
import Vuex from "vuex";
import tiles from "./modules/tiles";
import skippedRules from "./modules/skippedRules";
import userStats from "./modules/userStats";

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
    refusalReasons: {
      "false-positive":
        "False positive (the suggestion is wrong, the origin text is correct)",
      "false-correction":
        "False correction (both the original text and the suggestion are wrong)",
      "too-little-context": "Not enough context around the suggestion",
      "should-be-ignored":
        "This text shouldn't be checked (foreign language, markup, etc.)",
      other: "Other",
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
    userStats,
  },
});
