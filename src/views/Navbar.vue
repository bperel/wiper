<template>
  <nav class="navbar navbar-toggleable-md navbar-light bg-faded">
    <div style="text-align: left">
      <b-dropdown
        variant="outline-secondary"
        v-if="accessTokens && accessTokens.length"
        @shown="startCounterAnimations"
      >
        <span slot="button-content"> Menu </span>
        <b-dropdown-group header="Stats">
          <b-dropdown-group
            :header="supportedLanguages[languageCode]"
            :key="languageCode"
            v-for="languageCode in userStatsLanguageCodes"
          >
            <ul>
              <li
                v-for="decision in ['fix', 'skip', 'dontfix']"
                :key="decision"
              >
                <number
                  :ref="`${decision}-counter`"
                  :from="0"
                  :duration="3"
                  animation-paused
                  :to="getDecisionCount(languageCode, decision)"
                />
                x
                <DecisionButton :decision="decision" read-only />
              </li>
            </ul>
          </b-dropdown-group>
        </b-dropdown-group>
        <b-dropdown-item v-b-modal.modal-suggestion-history>
          View choice history
          <b-modal
            hide-footer
            id="modal-suggestion-history"
            title="Decision history (last 10 suggestions)"
            @show="getPastSuggestions()"
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
        <b-dropdown-group
          v-if="mostSkippedRulesLanguageCodes.length"
          header="Ignored rules"
        >
          <b-dropdown-group
            :header="supportedLanguages[languageCode]"
            :key="languageCode"
            v-for="languageCode in mostSkippedRulesLanguageCodes"
          >
            <b-dropdown-text
              v-for="rule in mostSkippedRules.filter(
                ({ languageCode: ruleLanguageCode }) =>
                  ruleLanguageCode === languageCode
              )"
              :key="rule.ruleid"
              :title="rule.description"
              v-b-tooltip.hover
            >
              <small>
                <b-button
                  @click.stop="toggleIgnoreRule({ rule })"
                  pill
                  size="sm"
                  :variant="rule.ignored ? 'primary' : 'outline-primary'"
                  ><b-icon-check v-if="rule.ignored" />&nbsp;Never show this
                  rule (skipped {{ rule.count }} times)</b-button
                >&nbsp;&nbsp;
                {{ rule.description }}
              </small>
            </b-dropdown-text>
          </b-dropdown-group>
        </b-dropdown-group>
      </b-dropdown>
    </div>
    <a id="brand" class="navbar-brand" href="javascript:void(0)">WiPeR</a>
    <b-dropdown
      right
      id="accounts"
      text="Wikipedia accounts"
      variant="outline-secondary"
    >
      <b-dropdown-item
        v-for="(languageName, languageCode) in supportedLanguages"
        :key="languageCode"
        @click.stop="loginOrLogout(languageCode)"
      >
        <b-badge>{{ languageCode }}</b-badge>
        <span class="language-name">{{ languageName }}</span>
        &nbsp;<b-button
          class="login-logout"
          pill
          size="sm"
          :variant="
            isAlreadyLoggedIn(languageCode)
              ? 'outline-danger'
              : 'outline-primary'
          "
          >{{ isAlreadyLoggedIn(languageCode) ? "Logout" : "Login" }}</b-button
        >
      </b-dropdown-item>
    </b-dropdown>
  </nav>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
import TileList from "../components/TileList";
import { BIconCheck } from "bootstrap-vue";
import DecisionButton from "../components/DecisionButton";

export default {
  name: "Navbar",
  components: { TileList, BIconCheck, DecisionButton },
  computed: {
    ...mapState([
      "LANGUAGETOOL_ENDPOINT_ROOT",
      "supportedLanguages",
      "accessTokens",
    ]),
    ...mapState("skippedRules", { mostSkippedRules: "list" }),
    ...mapState("userStats", { userStats: "list" }),
    ...mapState("tiles", { pastSuggestions: "pastList" }),
    ...mapGetters(["languageWithAccessToken"]),
    ...mapGetters("skippedRules", {
      mostSkippedRulesLanguageCodes: "languageCodes",
    }),
    ...mapGetters("userStats", {
      userStatsLanguageCodes: "languageCodes",
    }),
  },
  data: function () {
    return {
      error: null,
    };
  },
  watch: {
    accessTokens: {
      immediate: true,
      async handler(newValue) {
        if (newValue && newValue.length) {
          await this.$store.dispatch("skippedRules/loadList");
          await this.$store.dispatch("userStats/loadList");
        }
      },
    },
  },
  methods: {
    startCounterAnimations() {
      const vm = this;
      ["fix", "dontfix", "skip"].forEach((decision) => {
        vm.$refs[`${decision}-counter`][0].play();
      });
    },
    getDecisionCount(languageCode, decision) {
      return this.userStats.find(
        ({ languageCode: statLanguageCode, applied }) =>
          statLanguageCode === languageCode &&
          ((decision === "fix" && applied === true) ||
            (decision === "dontfix" && applied === false) ||
            (decision === "skip" && applied === null))
      ).count;
    },
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
    isAlreadyLoggedIn(languageCode) {
      return (this.accessTokens || [])
        .map((accessToken) => accessToken.languageCode)
        .includes(languageCode);
    },
    async getPastSuggestions() {
      try {
        await this.$store.dispatch("tiles/getPastSuggestions");
        this.error = null;
      } catch {
        this.error = "Something wrong occurred while fetching the suggestions";
      }
    },
    ...mapMutations("skippedRules", { setMostSkippedRules: "setList" }),
    ...mapActions("skippedRules", ["toggleIgnoreRule"]),
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

.navbar > * {
  width: 175px;
  margin: 0;
}

.language-name {
  display: inline-block;
  width: 90px;
  margin-left: 8px;
}

.login-logout {
  width: 60px;
}
</style>
