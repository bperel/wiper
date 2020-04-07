<template>
  <nav class="navbar navbar-toggleable-md navbar-light bg-faded">
    <a id="brand" class="navbar-brand" href="javascript:void(0)"
      >WiPeR<sup>alpha</sup></a
    >
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
    <b-dropdown id="login" text="Login">
      <b-dropdown-item
        v-for="languageCode in supportedLanguagesWithoutAccessTokens"
        :key="languageCode"
        @click="$emit('initLogin', languageCode)"
        >Wikipedia {{ languageCode }}
      </b-dropdown-item>
    </b-dropdown>
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

#brand,
#login {
  width: 100px;
  margin: 0;
}
</style>
