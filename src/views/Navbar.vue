<template>
  <nav class="navbar navbar-toggleable-md navbar-light bg-faded">
    <div>
      <b-dropdown
        v-if="accessTokens && Object.values(accessTokens).length"
        variant="outline-secondary"
      >
        <span slot="button-content">
          Menu
        </span>
        <b-dropdown-item v-b-modal.modal-suggestion-history>
          View choice history
          <b-modal
            hide-footer
            id="modal-suggestion-history"
            title="Decision history (last 10 suggestions)"
            @show="loadPastSuggestions()"
          >
            <b-alert v-if="error" show variant="danger">{{ error }}</b-alert>
            <tile-list
              v-else-if="pastSuggestions.length"
              :tiles="pastSuggestions"
              read-only
            />
            <b-spinner v-else label="Loading..."></b-spinner>
            <template v-slot:modal-footer />
          </b-modal>
        </b-dropdown-item>
        <b-dropdown-group header="Logout">
          <b-dropdown-item-button
            :key="accessTokenData.languageCode"
            v-for="accessTokenData in accessTokens"
            @click="$emit('logout', accessTokenData)"
            ><b-badge>{{ accessTokenData.languageCode }}</b-badge
            >&nbsp;{{ supportedLanguages[accessTokenData.languageCode] }}
          </b-dropdown-item-button>
        </b-dropdown-group>
      </b-dropdown>
    </div>
    <a id="brand" class="navbar-brand" href="javascript:void(0)"
      >WiPeR<sup>beta</sup></a
    >
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
import axios from "axios";
import TileList from "../components/TileList";

export default {
  name: "Navbar",
  components: { TileList },
  computed: {
    ...mapState(["LANGUAGETOOL_ENDPOINT_ROOT", "accessTokens"]),
  },
  data: function () {
    return {
      error: null,
      pastSuggestions: {},
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
    isAlreadyLoggedIn(supportedLanguage) {
      return (
        (this.accessTokens || [])
          .map((accessToken) => accessToken.languageCode)
          .indexOf(supportedLanguage) !== -1
      );
    },
    loadPastSuggestions() {
      let vm = this;
      axios
        .get(
          `${this.LANGUAGETOOL_ENDPOINT_ROOT}/suggestions/past?` +
            this.accessTokens
              .map(
                (accessToken) =>
                  `${accessToken.languageCode}=${accessToken.accessToken}`
              )
              .join(",")
        )
        .then(({ data }) => {
          vm.error = null;
          vm.pastSuggestions = data.suggestions;
        })
        .catch(() => {
          vm.error = "Something wrong occurred while fetching the suggestions";
        });
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
