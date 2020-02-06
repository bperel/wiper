<template>
  <div class="game">
    <b-alert v-if="error" show variant="danger">{{ error }}</b-alert>
    <TileList :articles="articles" />
  </div>
</template>

<script>
import TileList from "@/components/TileList.vue";
import axios from "axios";

export default {
  name: "game",
  data: () => ({
    articles: [],
    error: null
  }),

  mounted() {
    let vm = this;
    axios
      .get("http://localhost:8025/v2/wikipedia/suggestions")
      .then(({ data }) => {
        vm.articles = data.suggestions;
      })
      .catch(() => {
        vm.error = "Something wrong occurred while fetching the suggestions";
      });
  },
  components: {
    TileList
  }
};
</script>
