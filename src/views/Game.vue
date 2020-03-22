<template>
  <div class="game">
    <b-alert v-if="error" show variant="danger">{{ error }}</b-alert>
    <TileList
      :tiles="tiles"
      :activeTile="activeTile"
      @acceptSuggestionEdit="applySuggestionEditDecision(true)"
      @nextTile="nextTile()"
      @refuseSuggestionEdit="applySuggestionEditDecision(false)"
    />
  </div>
</template>

<script>
import TileList from "@/components/TileList.vue";
import axios from "axios";
import { mapState } from "vuex";

export default {
  name: "game",
  data: () => ({
    tiles: [],
    activeTile: null,
    error: null,
  }),

  computed: mapState(["LANGUAGETOOL_ENDPOINT_ROOT", "userAccessToken"]),

  mounted() {
    this.getSuggestions();
  },

  methods: {
    setFirstTileAsActive: function () {
      this.activeTile = this.tiles[0];
    },

    applySuggestionEditDecision: function (accept) {
      let vm = this;
      const params = new URLSearchParams();
      params.append("suggestion_id", vm.activeTile.suggestion.id);
      params.append("accessToken", vm.userAccessToken);
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
        .catch(() => {
          vm.error =
            "Something wrong occurred while submitting the suggestion decision";
        });
    },

    nextTile: function () {
      this.tiles.splice(0, 1);
      this.setFirstTileAsActive();
    },

    getSuggestions: function () {
      let vm = this;
      axios
        .get(`${this.LANGUAGETOOL_ENDPOINT_ROOT}/suggestions`)
        .then(({ data }) => {
          vm.tiles = data.suggestions;
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
