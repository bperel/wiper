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
        <b-dropdown-group header="Ignored rules">
          <b-dropdown-group
            :header="supportedLanguages[languageCode]"
            :key="languageCode"
            v-for="languageCode in mostSkippedRulesLanguageCodes"
          >
            <b-dropdown-text
              v-for="rule in mostSkippedRules.filter(
                (skippedRule) => skippedRule.languageCode === languageCode
              )"
              :key="rule.ruleid"
              :title="rule.description"
              v-b-tooltip.hover
            >
              <small>
                <b-button
                  @click.stop="toggleIgnoreRule(rule)"
                  pill
                  size="sm"
                  :variant="rule.ignored ? 'primary' : 'outline-primary'"
                  ><b-icon-check v-if="rule.ignored" />&nbsp;Never show this
                  rule (skipped {{ rule.count }} times)</b-button
                >
                {{ rule.description }}
              </small>
            </b-dropdown-text>
          </b-dropdown-group>
        </b-dropdown-group>
      </b-dropdown>
    </div>
    <a id="brand" class="navbar-brand" href="javascript:void(0)"
      >WiPeR<sup>beta</sup></a
    >
    <b-dropdown
      right
      id="accounts"
      text="Wikipedia accounts"
      variant="outline-secondary"
    >
      <b-dropdown-item
        v-for="(languageName, languageCode) in supportedLanguages"
        :key="languageCode"
        ><b-button
          @click.stop="loginOrLogout(languageCode)"
          class="login-logout"
          v-if="isAlreadyLoggedIn(languageCode)"
          pill
          size="sm"
          variant="outline-danger"
          >Logout</b-button
        ><b-button
          class="login-logout"
          v-else
          pill
          size="sm"
          variant="outline-primary"
          >Login</b-button
        >&nbsp;
        <b-badge>{{ languageCode }}</b-badge>
        &nbsp;
        {{ languageName }}
      </b-dropdown-item>
    </b-dropdown>
  </nav>
</template>

<script>
import { mapGetters, mapMutations, mapState } from "vuex";
import axios from "axios";
import TileList from "../components/TileList";
import { BIconCheck } from "bootstrap-vue";

export default {
  name: "Navbar",
  components: { TileList, BIconCheck },
  computed: {
    ...mapState([
      "LANGUAGETOOL_ENDPOINT_ROOT",
      "accessTokens",
      "mostSkippedRules",
    ]),
    ...mapGetters(["languageWithAccessToken", "mostSkippedRulesLanguageCodes"]),
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
  watch: {
    accessTokens: {
      immediate: true,
      async handler(newValue) {
        if (newValue && newValue.length) {
          await this.getMostSkippedRules();
        }
      },
    },
  },
  methods: {
    loginOrLogout(languageCode) {
      if (this.isAlreadyLoggedIn(languageCode)) {
        this.$emit(
          "logout",
          this.accessTokens.find(
            (accessTokenData) => accessTokenData.languageCode === languageCode
          )
        );
      } else {
        this.$emit("initLogin", languageCode);
      }
    },
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
    async toggleIgnoreRule(rule) {
      await axios.request({
        method: rule.ignored ? "delete" : "put",
        url: `${this.LANGUAGETOOL_ENDPOINT_ROOT}/ignoredRule/${
          rule.ignored ? "remove" : "add"
        }?languageCode=${rule.languageCode}&ruleid=${rule.ruleid}&accessToken=${
          this.accessTokens.find(
            (accessToken) => accessToken.languageCode === rule.languageCode
          ).accessToken
        }`,
      });
      await this.getMostSkippedRules();
    },
    async getMostSkippedRules() {
      const vm = this;
      const { data } = await axios.get(
        `${this.LANGUAGETOOL_ENDPOINT_ROOT}/mostSkipped?` +
          this.languageWithAccessToken.join(",")
      );
      vm.setMostSkippedRules(data);
    },
    ...mapMutations(["setMostSkippedRules"]),
  },
};
</script>

<style scoped>
button {
  font-size: smaller;
}
.badge {
  width: 25px;
  padding-top: 5px;
  vertical-align: middle;
}

header + ul {
  padding-left: 10px;
  white-space: nowrap;
}

#brand,
#accounts {
  width: 175px;
  margin: 0;
}

.login-logout {
  width: 60px;
}
</style>
