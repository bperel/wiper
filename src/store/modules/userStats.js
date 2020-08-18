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
};

const actions = {
  async loadList({ rootState, rootGetters, commit }) {
    const { data } = await axios.get(
      `${rootState.LANGUAGETOOL_ENDPOINT_ROOT}/user/stats?` +
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
