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

  computed: {
    ...mapState(["LANGUAGETOOL_ENDPOINT_ROOT", "accessTokens"]),
  },

  mounted() {
    this.readSessionUser();
  },

  methods: {
    ...mapMutations(["setUsername", "addAccessToken"]),
    initLogin: function (languageCode) {
      let vm = this;
      axios
        .get(
          `${this.LANGUAGETOOL_ENDPOINT_ROOT}/authorize?languageCode=${languageCode}`
        )
        .then(({ data }) => {
          const { authorizationUrl, requestToken } = data;
          vm.$cookies.set(
            `wiper_requestToken_${languageCode}`,
            requestToken,
            60 * 5,
            "/"
          );
          window.open(authorizationUrl, "_blank");
        })
        .catch(() => {
          vm.error =
            "Something wrong occurred while attempting to authorize the user";
        });
    },

    getLanguageCodeFromCookieWithPrefix(prefix) {
      return this.$cookies
        .keys()
        .filter((cookieName) => new RegExp(`^${prefix}`).test(cookieName))
        .map((cookieName) => cookieName.match(`^${prefix}_([a-z]+)$`)[1])[0];
    },

    readSessionUser: function () {
      let vm = this;
      if (this.$route.query.oauth_verifier) {
        const requestTokenLanguageCode = this.getLanguageCodeFromCookieWithPrefix(
          "wiper_requestToken"
        );
        if (requestTokenLanguageCode) {
          const requestTokenCookieKey = `wiper_requestToken_${requestTokenLanguageCode}`;
          return axios
            .get(
              `${this.LANGUAGETOOL_ENDPOINT_ROOT}/login?oauth_verifier=${
                vm.$route.query.oauth_verifier
              }&requestToken=${vm.$cookies.get(
                requestTokenCookieKey
              )}&languageCode=${requestTokenLanguageCode}`
            )
            .then(({ data }) => {
              const { accessToken } = data;
              vm.$cookies.set(
                `wiper_${requestTokenLanguageCode}`,
                accessToken,
                60 * 60 * 24 * 30,
                "/"
              );
              vm.$cookies.remove(requestTokenCookieKey);
              window.location.replace("/");
            })
            .catch(() => {
              vm.error = "Something wrong occurred while attempting to login";
            });
        }
        return Promise.reject(new Error("No request token in cookies"));
      } else {
        const accessTokenLanguageCode = this.getLanguageCodeFromCookieWithPrefix(
          "wiper"
        );
        if (accessTokenLanguageCode) {
          const accessTokenCookieKey = `wiper_${accessTokenLanguageCode}`;
          axios
            .get(
              `${
                this.LANGUAGETOOL_ENDPOINT_ROOT
              }/user?accessToken=${vm.$cookies.get(
                accessTokenCookieKey
              )}&languageCode=${accessTokenLanguageCode}`
            )
            .then(({ data }) => {
              vm.addAccessToken({
                languageCode: accessTokenLanguageCode,
                username: data.userName,
                accessToken: vm.$cookies.get(accessTokenCookieKey),
              });
            })
            .catch(() => {
              vm.error =
                "Something wrong occurred while refusing the suggestion";
            });
        }
      }
      return Promise.reject(new Error("No session"));
    },
  },
};
</script>
