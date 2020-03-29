<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <a class="navbar-brand" href="#">WiPeR<sup>alpha</sup></a>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto"></ul>
      <button
        :key="accessTokenData.languageCode"
        v-for="accessTokenData in accessTokens"
        class="btn btn-outline-info"
        disabled
      >
        {{ accessTokenData.username }}&nbsp;<b-badge>{{
          accessTokenData.languageCode
        }}</b-badge>
      </button>
      <b-dropdown text="Login" right>
        <b-dropdown-item
          v-for="languageCode in supportedLanguagesWithoutAccessTokens"
          :key="languageCode"
          @click="$emit('initLogin', languageCode)"
          >Wikipedia {{ languageCode }}
        </b-dropdown-item>
      </b-dropdown>
    </div>
  </nav>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Navbar",
  computed: {
    ...mapState(["accessTokens"]),
    supportedLanguagesWithoutAccessTokens: function () {
      return this.supportedLanguages.filter(
        (supportedLanguage) =>
          this.accessTokens
            .map((accessToken) => accessToken.languageCode)
            .indexOf(supportedLanguage) === -1
      );
    },
  },
  data: function () {
    return {
      supportedLanguages: [
        "ca",
        "de",
        "en",
        "fr",
        "nl",
        "pl",
        "pt",
        "ru",
        "uk",
      ],
    };
  },
};
</script>

<style scoped>
button[disabled] {
  cursor: initial;
}
</style>
