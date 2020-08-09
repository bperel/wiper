import axios from "axios";

const state = {
  list: [],
  pastList: [],
  active: null,
};

const mutations = {
  setFirstAsActive(state) {
    state.active = state.list[0];
  },
};

const actions = {
  nextTile({ state, commit, dispatch }) {
    state.list.splice(0, 1);
    commit("setFirstAsActive");
    if (state.list.length === 0) {
      dispatch("getSuggestions");
    }
  },

  async getPastSuggestions({ state, rootState }) {
    const { data } = await axios.get(
      `${rootState.LANGUAGETOOL_ENDPOINT_ROOT}/suggestions/past?` +
        rootState.accessTokens
          .map(
            (accessToken) =>
              `${accessToken.languageCode}=${accessToken.accessToken}`
          )
          .join(",")
    );
    state.pastList = data.suggestions;
  },

  getSuggestions({ state, rootState, rootGetters, commit }) {
    axios
      .get(
        `${rootState.LANGUAGETOOL_ENDPOINT_ROOT}/suggestions?` +
          rootGetters.languageWithAccessToken.join(",")
      )
      .then(({ data }) => {
        state.list = (state.list || []).concat(data.suggestions);
        commit("setFirstAsActive");
      });
  },

  async applyDecision({ state, rootState }, { decision, reason = null }) {
    const params = new URLSearchParams();
    params.append("suggestion_id", state.active.suggestion.id);
    params.append("languageCode", state.active.article.languageCode);
    params.append(
      "accessToken",
      rootState.accessTokens.filter(
        ({ languageCode }) => languageCode === state.active.article.languageCode
      )[0].accessToken
    );
    if (reason) {
      params.append("reason", reason);
    }
    await axios.post(
      `${rootState.LANGUAGETOOL_ENDPOINT_ROOT}/suggestion/${decision}`,
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
      }
    );
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
