<template>
  <div id="app">
    <Navbar @initLogin="initLogin" />
    <div id="nav">
      <router-link to="/">Game</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view />
  </div>
</template>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
<script>
import Navbar from "./views/Navbar";
import axios from "axios";
import { mapMutations, mapState } from "vuex";
export default {
  components: { Navbar },

  computed: mapState(["LANGUAGETOOL_ENDPOINT_ROOT", "userAccessToken"]),

  mounted() {
    this.readSessionUser();
  },

  methods: {
    ...mapMutations(["setUsername", "setUserAccessToken"]),
    initLogin: function () {
      let vm = this;
      axios
        .get(`${this.LANGUAGETOOL_ENDPOINT_ROOT}/authorize`)
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

    readSessionUser: function () {
      let vm = this;
      if (this.$route.query.oauth_verifier) {
        if (this.$cookies.isKey("wiper_requestToken")) {
          return axios
            .get(
              `${this.LANGUAGETOOL_ENDPOINT_ROOT}/login?oauth_verifier=${
                vm.$route.query.oauth_verifier
              }&requestToken=${vm.$cookies.get("wiper_requestToken")}`
            )
            .then(({ data }) => {
              const { accessToken } = data;
              vm.setUserAccessToken(accessToken);
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
        vm.setUserAccessToken(vm.$cookies.get("wiper"));
        axios
          .get(
            `${
              this.LANGUAGETOOL_ENDPOINT_ROOT
            }/user?accessToken=${vm.$cookies.get("wiper")}`
          )
          .then(({ data }) => {
            vm.setUsername(data.userName);
          })
          .catch(() => {
            vm.error = "Something wrong occurred while refusing the suggestion";
          });
      }
      return Promise.reject(new Error("No session"));
    },
  },
};
</script>
