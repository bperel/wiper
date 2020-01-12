<template>
  <div class="home">
    <TileList :articles="articles" />
  </div>
</template>

<script>
import TileList from "@/components/TileList.vue";

export default {
  name: "home",
  data: () => ({
    articles: [
      {
        title: "Dextera Domini",
        url: "https://fr.wikipedia.org/wiki/Dextera_Domini",
        namespace: "frwiki"
      }
    ]
  }),
  components: {
    TileList
  }
};
</script>
