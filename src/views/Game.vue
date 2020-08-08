<template>
  <div class="game">
    <b-alert v-if="error" show variant="danger">{{ error }}</b-alert>
    <b-alert
      v-else-if="!error && accessTokens && !accessTokens.length"
      show
      variant="warning"
      >You need to be logged in to play this game. Click on the "Accounts"
      button on the top right of this page!
    </b-alert>
    <b-alert v-else-if="!error && tiles && !tiles.length" show variant="info">
      There are no suggestions for the moment.
    </b-alert>
    <TileList
      v-else
      :tiles="tiles"
      :activeTile="activeTile"
      @applySuggestionDecision="applySuggestionDecision"
    />
  </div>
</template>

<script>
import TileList from "@/components/TileList.vue";
import axios from "axios";
import { mapGetters, mapState } from "vuex";

export default {
  name: "game",
  data: () => ({
    tiles: null,
    activeTile: null,
    error: null,
  }),

  computed: {
    ...mapGetters(["languageWithAccessToken"]),
    ...mapState(["LANGUAGETOOL_ENDPOINT_ROOT", "accessTokens"]),
  },

  watch: {
    accessTokens: {
      immediate: true,
      handler(newValue) {
        if (newValue && newValue.length) {
          this.getSuggestions();
        }
      },
    },
  },

  methods: {
    setFirstTileAsActive() {
      this.activeTile = this.tiles[0];
    },

    applySuggestionDecision(decision, { reason } = { reason: null }) {
      let vm = this;
      const params = new URLSearchParams();
      params.append("suggestion_id", vm.activeTile.suggestion.id);
      params.append("languageCode", vm.activeTile.article.languageCode);
      params.append(
        "accessToken",
        vm.accessTokens.filter(
          ({ languageCode }) =>
            languageCode === vm.activeTile.article.languageCode
        )[0].accessToken
      );
      if (reason) {
        params.append("reason", reason);
      }
      axios
        .post(
          `${this.LANGUAGETOOL_ENDPOINT_ROOT}/suggestion/${decision}`,
          params,
          {
            headers: {
              "Content-Type":
                "application/x-www-form-urlencoded; charset=UTF-8",
            },
          }
        )
        .then(() => {
          this.nextTile();
        })
        .catch(({ response }) => {
          this.nextTile();
          this.$bvToast.toast(
            response.data.error || "An unexpected error occurred"
          );
        });
    },

    nextTile() {
      this.tiles.splice(0, 1);
      this.setFirstTileAsActive();
      if (this.tiles.length === 0) {
        this.getSuggestions();
      }
    },

    getSuggestions() {
      let vm = this;
      axios
        .get(
          `${this.LANGUAGETOOL_ENDPOINT_ROOT}/suggestions?` +
            this.languageWithAccessToken.join(",")
        )
        .then(({ data }) => {
          vm.tiles = (vm.tiles || []).concat(data.suggestions);
          vm.setFirstTileAsActive();
        })
        .catch(() => {
          vm.error = "Something wrong occurred while fetching the suggestions";
        });
    },
  },

  components: {
    TileList,
  },
};
</script>
