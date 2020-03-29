<template>
  <div class="game">
    <b-alert v-if="error" show variant="danger">{{ error }}</b-alert>
    <b-alert v-if="!error && !tiles.length" show variant="info">
      There are no suggestions for the moment.
    </b-alert>
    <b-alert
      v-if="!error && tiles.length && !accessTokens.length"
      show
      variant="warning"
      >You need to be logged to play this game. Click on the button on the top
      right of this page!
    </b-alert>
    <TileList
      :disabled="!accessTokens.length"
      :tiles="tiles"
      :activeTile="activeTile"
      @acceptSuggestionEdit="applySuggestionEditDecision(true)"
      @nextTile="nextTile()"
      @refuseSuggestionEdit="applySuggestionEditDecision(false, $event.reason)"
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
    tiles: [],
    activeTile: null,
    error: null,
  }),

  computed: {
    ...mapState([
      "LANGUAGETOOL_ENDPOINT_ROOT",
      "accessTokens",
      "currentLanguageCode",
    ]),
  },

  mounted() {
    this.getSuggestions();
  },

  methods: {
    setFirstTileAsActive: function () {
      this.activeTile = this.tiles[0];
    },

    applySuggestionEditDecision: function (accept, reason) {
      let vm = this;
      const params = new URLSearchParams();
      params.append("suggestion_id", vm.activeTile.suggestion.id);
      params.append("reason", reason || null);
      params.append("languageCode", vm.activeTile.article.languageCode);
      params.append(
        "accessToken",
        vm.accessTokens.filter(
          ({ languageCode }) => languageCode === vm.currentLanguageCode
        )[0].accessToken
      );
      axios
        .post(
          `${this.LANGUAGETOOL_ENDPOINT_ROOT}/suggestion/${
            accept ? "accept" : "refuse"
          }`,
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

    nextTile: function () {
      this.tiles.splice(0, 1);
      this.setFirstTileAsActive();
      if (this.tiles.length === 0) {
        this.getSuggestions();
      }
    },

    getSuggestions: function () {
      let vm = this;
      axios
        .get(`${this.LANGUAGETOOL_ENDPOINT_ROOT}/suggestions`)
        .then(({ data }) => {
          vm.tiles = vm.tiles.concat(data.suggestions);
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
