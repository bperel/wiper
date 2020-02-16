<template>
  <b-container>
    <b-row>
      <b-row
        class="gametitle"
        v-for="article in articles"
        :key="article.id"
        :class="{ active: activeSuggestionId }"
      >
        <b-col md="12" class="section">
          <div class="sec_text_title">
            <a class="external" target="_blank" :href="article.sourceuri">
              {{ article.sourceuri }}
            </a>
            <small>[{{ article.sourceType }}]</small>
          </div>
          <div class="item_preview">
            <div class="item_label">
              {{ article.message }}
              <div>
                <small>
                  {{ article.ruleDescription }}
                </small>
                <SuggestionDiff
                  v-if="article.id === activeSuggestionId"
                  :suggestion-id="activeSuggestionId"
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
                  :disabled="!(article.id === activeSuggestionId && ready)"
                  size="lg"
                  variant="success"
                  >Fix</b-btn
                >
                <b-btn
                  :disabled="!(article.id === activeSuggestionId && ready)"
                  size="lg"
                  variant="light"
                  >Skip</b-btn
                >
                <b-btn
                  :disabled="!(article.id === activeSuggestionId && ready)"
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
  props: ["activeSuggestionId", "articles"],
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
