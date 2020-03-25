<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <a class="navbar-brand" href="#">WiPeR</a>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto"></ul>
      <button
        :key="accessTokenData.languageCode"
        v-for="accessTokenData in accessTokens"
        class="btn btn-outline-info"
        disabled
      >
        {{ accessTokenData.username }}&nbsp;<b-badge>{{ accessTokenData.languageCode }}</b-badge>
      </button>
      <b-dropdown v-if="!accessTokens.length" text="Login" right>
        <b-dropdown-item
          v-for="languageCode in supportedLanguages"
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
  },
  data: function () {
    return { supportedLanguages: ["fr"] };
  },
};
</script>

<style scoped>
button[disabled] {
  cursor: initial;
}
</style>
