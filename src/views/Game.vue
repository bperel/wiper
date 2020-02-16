<template>
  <div class="game">
    <b-alert v-if="error" show variant="danger">{{ error }}</b-alert>
    <TileList :articles="articles" :activeSuggestionId="activeSuggestionId" />
  </div>
</template>

<script>
import TileList from "@/components/TileList.vue";
import axios from "axios";

export default {
  name: "game",
  data: () => ({
    articles: [],
    activeSuggestionId: null,
    error: null
  }),

  mounted() {
    let vm = this;
    axios
      .get("http://localhost:8081/v2/wikipedia/suggestions")
      .then(({ data }) => {
        vm.articles = data.suggestions;
        vm.setFirstSuggestionAsActive();
      })
      .catch(() => {
        vm.error = "Something wrong occurred while fetching the suggestions";
      });
  },

  methods: {
    setFirstSuggestionAsActive: function() {
      this.activeSuggestionId = this.articles[0].id;
    }
  },

  components: {
    TileList
  }
};
</script>
