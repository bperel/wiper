import axios from "axios";

const state = {
  list: [],
};

const mutations = {
  setList(state, list) {
    state.list = list;
  },
};

const getters = {
  languageCodes: (state) => [
    ...new Set([...state.list.map((skippedRule) => skippedRule.languageCode)]),
  ],
  notIgnored: (state) =>
    state.list.filter((skippedRule) => !skippedRule.ignored),
};

const actions = {
  async toggleIgnoreRule({ store, rootState, dispatch }, { rule }) {
    const accessToken = rootState.accessTokens.find(
      (accessToken) => accessToken.languageCode === rule.languageCode
    ).accessToken;
    await axios.request({
      method: rule.ignored ? "delete" : "put",
      url: `${rootState.LANGUAGETOOL_ENDPOINT_ROOT}/ignoredRule/${
        rule.ignored ? "remove" : "add"
      }?languageCode=${rule.languageCode}&ruleid=${
        rule.ruleid
      }&accessToken=${accessToken}`,
    });
    await dispatch("loadList");
  },
  async loadList({ rootState, rootGetters, commit }) {
    const { data } = await axios.get(
      `${rootState.LANGUAGETOOL_ENDPOINT_ROOT}/mostSkipped?` +
        rootGetters.languageWithAccessToken.join(",")
    );
    commit("setList", data);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions,
};
