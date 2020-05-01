<template>
  <div id="app">
    <Navbar @initLogin="initLogin" @logout="logout" />
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
    this.readCookieUser();
  },

  methods: {
    ...mapMutations(["initAccessTokens", "addAccessToken"]),
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

    logout: function ({ languageCode, accessToken }) {
      let vm = this;
      axios
        .get(
          `${this.LANGUAGETOOL_ENDPOINT_ROOT}/logout?accessToken=${accessToken}`
        )
        .then(() => {
          vm.$cookies.remove(`wiper_${languageCode}`);
          window.location.reload();
        })
        .catch(() => {
          vm.error =
            "Something wrong occurred while attempting to logout the user";
        });
    },

    getLanguageCodeFromCookiesWithPrefix(prefix) {
      return this.$cookies
        .keys()
        .filter((cookieName) => new RegExp(`^${prefix}`).test(cookieName))
        .map((cookieName) => cookieName.match(`^${prefix}_([a-z]+)$`)[1]);
    },

    readRequestTokenCookies() {
      let vm = this;
      const requests = this.getLanguageCodeFromCookiesWithPrefix(
        "wiper_requestToken"
      ).map((languageCode) =>
        axios.get(
          `${this.LANGUAGETOOL_ENDPOINT_ROOT}/login?oauth_verifier=${
            vm.$route.query.oauth_verifier
          }&requestToken=${vm.$cookies.get(
            `wiper_requestToken_${languageCode}`
          )}&languageCode=${languageCode}`
        )
      );
      axios
        .all(requests)
        .then(
          axios.spread((...responses) => {
            responses.forEach(({ data }) => {
              const { accessToken, languageCode } = data;
              vm.$cookies.set(
                `wiper_${languageCode}`,
                accessToken,
                60 * 60 * 24 * 30,
                "/"
              );
              vm.$cookies.remove(`wiper_requestToken_${languageCode}`);
              vm.$router.push(vm.$route.path);
            });
            vm.readAccessTokenCookies();
          })
        )
        .catch(() => {
          vm.error = "Something wrong occurred while attempting to login";
        });

      return Promise.reject(new Error("No request token in cookies"));
    },

    readAccessTokenCookies() {
      let vm = this;
      const requests = this.getLanguageCodeFromCookiesWithPrefix(
        "wiper"
      ).map((languageCode) =>
        axios
          .get(
            `${
              this.LANGUAGETOOL_ENDPOINT_ROOT
            }/user?accessToken=${vm.$cookies.get(
              `wiper_${languageCode}`
            )}&languageCode=${languageCode}`
          )
          .catch(() => null)
      );
      axios.all(requests).then(
        axios.spread((...responses) => {
          vm.initAccessTokens();
          responses
            .filter((response) => !!response)
            .forEach(({ data }) => {
              const { userName, languageCode } = data;
              vm.addAccessToken({
                languageCode: languageCode,
                username: userName,
                accessToken: vm.$cookies.get(`wiper_${languageCode}`),
              });
            });
        })
      );
    },

    readCookieUser: function () {
      if (this.$route.query.oauth_verifier) {
        this.readRequestTokenCookies();
      } else {
        this.readAccessTokenCookies();
      }
      return Promise.reject(new Error("No session"));
    },
  },
};
</script>
