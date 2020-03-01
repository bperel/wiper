<template>
  <div class="game">
    <b-alert v-if="error" show variant="danger">{{ error }}</b-alert>
    <TileList :tiles="tiles" :activeTile="activeTile" @nextTile="nextTile()" />
  </div>
</template>

<script>
import TileList from "@/components/TileList.vue";
import axios from "axios";

export default {
  name: "game",
  data: () => ({
    tiles: [],
    activeTile: null,
    error: null
  }),

  mounted() {
    let vm = this;
    axios
      .get("http://localhost:8081/v2/wikipedia/suggestions")
      .then(({ data }) => {
        vm.tiles = data.suggestions;
        vm.setFirstTileAsActive();
      })
      .catch(() => {
        vm.error = "Something wrong occurred while fetching the suggestions";
      });
  },

  methods: {
    setFirstTileAsActive: function() {
      this.activeTile = this.tiles[0];
    },

    nextTile: function() {
      this.tiles.splice(0, 1);
      this.setFirstTileAsActive();
    }
  },

  components: {
    TileList
  }
};
</script>
