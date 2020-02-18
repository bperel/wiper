<template>
  <b-container>
    <b-row>
      <b-row
        class="gametitle"
        v-for="tile in tiles"
        :key="tile.suggestion.id"
        :class="{ active: activeTile.suggestion.id === tile.suggestion.id }"
      >
        <b-col md="12" class="section">
          <div class="sec_text_title">
            <a class="external" target="_blank" :href="tile.article.sourceuri">
              {{ tile.article.title }}
            </a>
            <small>[{{ tile.suggestion.sourceType }} {{ tile.suggestion.languageCode }}]</small>
          </div>
          <div class="item_preview">
            <div class="item_label">
              {{ tile.suggestion.message }}
              <div>
                <small>
                  {{ tile.suggestion.ruleDescription }}
                </small>
                <SuggestionDiff
                  v-if="tile.suggestion.id === activeTile.suggestion.id"
                  :suggestion-id="activeTile.suggestion.id"
                  @suggestion-diff-loaded="ready = true"
                />
              </div>
            </div>
          </div>
        </b-col>
        <b-col md="12" class="control_box">
          <b-row>
            <b-col md="12" class="control">
              <b-btn-group size="lg">
                <b-btn
                  :disabled="
                    !(tile.suggestion.id === activeTile.suggestion.id && ready)
                  "
                  size="lg"
                  variant="success"
                  >Fix</b-btn
                >
                <b-btn
                  :disabled="
                    !(tile.suggestion.id === activeTile.suggestion.id && ready)
                  "
                  size="lg"
                  variant="light"
                  >Skip</b-btn
                >
                <b-btn
                  :disabled="
                    !(tile.suggestion.id === activeTile.suggestion.id && ready)
                  "
                  size="lg"
                  variant="primary"
                  >Do not fix</b-btn
                >
              </b-btn-group>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-row>
  </b-container>
</template>

<script>
import SuggestionDiff from "./SuggestionDiff";

export default {
  name: "TileList",
  components: { SuggestionDiff },
  props: ["activeTile", "tiles"],
  data: () => ({
    ready: false
  })
};
</script>

<style scoped lang="scss">
.gametitle {
  border-radius: 10px;
  box-shadow: 10px 10px 5px #888;
  margin-bottom: 20px;
  padding: 5px;
  min-height: 20px;
  width: 100%;

  &.active {
    border: 3px solid #2966b8;
    color: #111111;
    background-color: #fffff8;

    a {
      color: #2966b8;
    }
  }

  .section {
    text-align: left;
    .sec_text_title {
      font-size: 16pt;

      &,
      * {
        font-weight: bold !important;
      }
    }
  }
}
</style>
