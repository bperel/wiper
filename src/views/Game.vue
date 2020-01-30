<template>
  <div class="game">
    <TileList :articles="articles" />
  </div>
</template>

<script>
import TileList from "@/components/TileList.vue";
import axios from "axios";

export default {
  name: "game",
  data: () => ({
    articles: []
  }),

  mounted() {
    let vm = this;
    axios
      .get("http://localhost:8025/v2/wikipedia/suggestions")
      .then(({ data }) => {
        vm.articles = data.suggestions;
      });
  },
  components: {
    TileList
  }
};
</script>
