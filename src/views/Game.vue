<template>
  <div class="game">
    <b-alert v-if="error" show variant="danger">{{ error }}</b-alert>
    <b-alert
      v-else-if="accessTokens && !accessTokens.length"
      show
      variant="warning"
      >You need to be logged in to play this game. Click on the "Accounts"
      button on the top right of this page!
    </b-alert>
    <b-alert v-else-if="!tiles" show variant="info">
      Loading suggestions...
    </b-alert>
    <b-alert v-else-if="!tiles.length" show variant="info">
      There are no suggestions for the moment.
    </b-alert>
    <template v-else>
      <b-alert
        v-if="ignoreRuleAlert && mostSkippedRulesNotIgnored.length"
        dismissible
        @dismissed="ignoreRuleAlert = false"
        show
        variant="info"
        >It looks like you have skipped the same type of suggestions many
        times.<br />
        If you don't want Wiper to suggest you these kinds of suggestions, you
        can ignore them using the top-left menu.</b-alert
      >
      <b-alert
        v-if="introAlert"
        dismissible
        @dismissed="introAlert = false"
        show
        variant="light"
      >
        Wiper found Wikipedia articles with potential spelling or grammar
        issues.<br />
        Click on <decision-button decision="fix" read-only /> to fix the issue
        in the Wikipedia article, <br />
        <decision-button decision="skip" read-only /> to ignore this specific
        suggestion to your user, or <br />
        <decision-button decision="dontfix" read-only /> to hide this suggestion
        to all Wiper users.
      </b-alert>
      <TileList
        :tiles="tiles"
        :activeTile="activeTile"
        @apply-decision="applyGameDecision"
      />
    </template>
  </div>
</template>

<script>
import TileList from "@/components/TileList.vue";
import { mapActions, mapGetters, mapState } from "vuex";
import DecisionButton from "../components/DecisionButton";

export default {
  name: "game",
  data: () => ({
    error: null,
    introAlert: true,
    ignoreRuleAlert: true,
  }),

  computed: {
    ...mapGetters(["languageWithAccessToken"]),
    ...mapGetters("skippedRules", { mostSkippedRulesNotIgnored: "notIgnored" }),
    ...mapState(["LANGUAGETOOL_ENDPOINT_ROOT", "accessTokens"]),
    ...mapState("tiles", { tiles: "list", activeTile: "active" }),
  },

  watch: {
    accessTokens: {
      immediate: true,
      handler(newValue) {
        if (newValue && newValue.length) {
          this.getGameSuggestions();
        }
      },
    },
  },

  methods: {
    ...mapActions("tiles", ["nextTile", "getSuggestions", "applyDecision"]),
    ...mapActions("skippedRules", { loadSkippedRulesList: "loadList" }),
    async applyGameDecision({ decision, reason = null }) {
      const vm = this;
      await this.applyDecision({ decision, reason }).catch((response) => {
        vm.$bvToast.toast(
          (response || { message: null }).message ||
            "An unexpected error occurred"
        );
      });
      this.nextTile();
      await this.loadSkippedRulesList();
    },

    getGameSuggestions() {
      const vm = this;
      this.getSuggestions().catch(() => {
        vm.error = "Something wrong occurred while fetching the suggestions";
      });
    },
  },

  components: {
    DecisionButton,
    TileList,
  },
};
</script>
