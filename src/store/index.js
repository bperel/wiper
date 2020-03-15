import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    username: null,
    LANGUAGETOOL_ENDPOINT_ROOT: "http://localhost:8081/v2/wikipedia"
  },
  mutations: {
    setUsername(state, username) {
      state.username = username;
    },
    setUserAccessToken(state, accessToken) {
      state.userAccessToken = accessToken;
    }
  },
  actions: {},
  modules: {}
});
