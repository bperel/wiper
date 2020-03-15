<template>
  <div class="game">
    <b-alert v-if="error" show variant="danger">{{ error }}</b-alert>
    <TileList
      :tiles="tiles"
      :activeTile="activeTile"
      @acceptSuggestionEdit="acceptSuggestionEdit()"
      @nextTile="nextTile()"
      @refuseSuggestionEdit="refuseSuggestionEdit()"
    />
  </div>
</template>

<script>
import TileList from "@/components/TileList.vue";
import axios from "axios";
const LANGUAGETOOL_ENDPOINT_ROOT = "http://localhost:8081/v2/wikipedia";

export default {
  name: "game",
  data: () => ({
    tiles: [],
    activeTile: null,
    error: null
  }),

  mounted() {
    this.getSuggestions();
  },

  methods: {
    setFirstTileAsActive: function() {
      this.activeTile = this.tiles[0];
    },

    acceptSuggestionEdit: function() {
      let vm = this;
      axios
        .post(`${LANGUAGETOOL_ENDPOINT_ROOT}/suggestion/accept`, {
          suggestion_id: vm.activeTile.suggestion.id,
          accessToken: vm.$cookies.get("wiper")
        })
        .then(() => {
          this.nextTile();
        })
        .catch(() => {
          vm.error = "Something wrong occurred while accepting the suggestion";
        });
    },

    refuseSuggestionEdit: function() {
      let vm = this;
      axios
        .post(`${LANGUAGETOOL_ENDPOINT_ROOT}/suggestion/refuse`, {
          suggestion_id: vm.activeTile.suggestion.id,
          accessToken: vm.$cookies.get("wiper")
        })
        .then(() => {
          this.nextTile();
        })
        .catch(() => {
          vm.error = "Something wrong occurred while refusing the suggestion";
        });
    },

    nextTile: function() {
      this.tiles.splice(0, 1);
      this.setFirstTileAsActive();
    },

    getSuggestions: function() {
      let vm = this;
      axios
        .get(`${LANGUAGETOOL_ENDPOINT_ROOT}/suggestions`)
        .then(({ data }) => {
          vm.tiles = data.suggestions;
          vm.setFirstTileAsActive();
        })
        .catch(() => {
          vm.error = "Something wrong occurred while fetching the suggestions";
        });
    }
  },

  components: {
    TileList
  }
};
</script>
