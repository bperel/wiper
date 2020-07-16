<template>
  <nav class="navbar navbar-toggleable-md navbar-light bg-faded">
    <a id="brand" class="navbar-brand" href="javascript:void(0)"
      >WiPeR<sup>beta</sup></a
    >
    <div>
      <b-dropdown
        :key="accessTokenData.languageCode"
        v-for="accessTokenData in accessTokens"
        variant="outline-secondary"
      >
        <span slot="button-content">
          {{ accessTokenData.username }}
          &nbsp;
          <b-badge>{{ accessTokenData.languageCode }}</b-badge>
        </span>
        <b-dropdown-item @click="$emit('logout', accessTokenData)">
          Logout
        </b-dropdown-item>
      </b-dropdown>
    </div>
    <b-dropdown right id="login" text="Login">
      <b-dropdown-item
        v-for="(languageName, languageCode) in supportedLanguages"
        :key="languageCode"
        :disabled="isAlreadyLoggedIn(languageCode)"
        @click="$emit('initLogin', languageCode)"
      >
        <b-badge>{{ languageCode }}</b-badge>
        &nbsp;
        {{ languageName }}
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
  },
  data: function () {
    return {
      supportedLanguages: {
        ca: "Català",
        de: "Deutsch",
        fr: "Français",
        nl: "Nederlands",
        pl: "Polski",
        pt: "Português",
        ru: "Русский",
        uk: "Українська",
      },
    };
  },
  methods: {
    isAlreadyLoggedIn: function (supportedLanguage) {
      return (
        (this.accessTokens || [])
          .map((accessToken) => accessToken.languageCode)
          .indexOf(supportedLanguage) !== -1
      );
    },
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
.badge {
  width: 25px;
  padding-top: 5px;
  vertical-align: middle;
}
</style>
