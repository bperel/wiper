<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <a class="navbar-brand" href="#">WiPeR</a>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto"></ul>
      <button v-if="username" class="btn btn-outline-info" disabled>
        {{ username }}
      </button>
      <button v-if="!username" class="btn" @click="initLogin">
        Log in
      </button>
    </div>
  </nav>
</template>

<script>
import axios from "axios";
const LANGUAGETOOL_ENDPOINT_ROOT = "http://localhost:8081/v2/wikipedia";

export default {
  name: "Navbar",
  data: () => ({
    username: null
  }),

  mounted() {
    this.readSessionUser();
  },

  methods: {
    initLogin: function() {
      let vm = this;
      axios
        .get(`${LANGUAGETOOL_ENDPOINT_ROOT}/authorize`)
        .then(({ data }) => {
          const { authorizationUrl, requestToken } = data;
          vm.$cookies.set("wiper_requestToken", requestToken, 60 * 5, "/");
          window.open(authorizationUrl, "_blank");
        })
        .catch(() => {
          vm.error =
            "Something wrong occurred while attempting to authorize the user";
        });
    },

    readSessionUser: function() {
      let vm = this;
      if (this.$route.query.oauth_verifier) {
        if (this.$cookies.isKey("wiper_requestToken")) {
          return axios
            .get(
              `${LANGUAGETOOL_ENDPOINT_ROOT}/login?oauth_verifier=${
                vm.$route.query.oauth_verifier
              }&requestToken=${vm.$cookies.get("wiper_requestToken")}`
            )
            .then(({ data }) => {
              const { accessToken } = data;
              vm.$cookies.set("wiper", accessToken, 60 * 60 * 24 * 30, "/");
              vm.$cookies.remove("wiper_requestToken");
              window.location.replace("/");
            })
            .catch(() => {
              vm.error = "Something wrong occurred while attempting to login";
            });
        }
        return Promise.reject(new Error("No request token in cookies"));
      } else if (this.$cookies.isKey("wiper")) {
        axios
          .get(
            `${LANGUAGETOOL_ENDPOINT_ROOT}/user?accessToken=${vm.$cookies.get(
              "wiper"
            )}`
          )
          .then(({ data }) => {
            vm.username = data.userName;
          })
          .catch(() => {
            vm.error = "Something wrong occurred while refusing the suggestion";
          });
      }
      return Promise.reject(new Error("No session"));
    }
  }
};
</script>

<style scoped>
button[disabled] {
  cursor: initial;
}
</style>
