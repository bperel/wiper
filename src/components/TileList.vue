<template>
  <b-container>
    <b-row>
      <b-row
        class="gametitle"
        v-for="tile in tiles"
        :key="tile.suggestion.id"
        :class="{
          active: activeTile.suggestion.id === tile.suggestion.id,
          disabled,
        }"
      >
        <b-col md="12" class="section">
          <div class="sec_text_title">
            <a class="external" target="_blank" :href="tile.article.sourceuri">
              {{ tile.article.title }}
            </a>
            <small
              >[{{ tile.suggestion.sourceType }}
              {{ tile.suggestion.languageCode }}]</small
            >
          </div>
          <div class="item_preview">
            <div class="item_label" v-html="tile.suggestion.message"></div>
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
                  @click="acceptSuggestionEdit"
                  >Fix</b-btn
                >
                <b-btn
                  :disabled="
                    !(tile.suggestion.id === activeTile.suggestion.id && ready)
                  "
                  size="lg"
                  variant="light"
                  @click="$emit('nextTile')"
                  >Skip</b-btn
                >
                <b-dropdown
                  :disabled="
                    !(tile.suggestion.id === activeTile.suggestion.id && ready)
                  "
                  size="lg"
                  text="Do not fix"
                  variant="primary"
                >
                  <b-dropdown-item
                    v-for="(value, key) in refusalReasons"
                    :key="key"
                    @click="refuseSuggestionEdit(key)"
                    >{{ value }}
                  </b-dropdown-item>
                </b-dropdown>
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
  props: ["activeTile", "tiles", "disabled"],
  data: () => ({
    ready: false,
    pendingSubmitSuggestion: null,
    refusalReasons: {
      "false-positive":
        "False positive (the suggestion is wrong, the origin text is correct)",
      "false-correction":
        "False correction (both the original text and the suggestion are wrong)",
      "too-little-context": "Not enough context around the suggestion",
      "should-be-ignored":
        "This text shouldn't be checked (foreign language, markup, etc.)",
      other: "Other",
    },
  }),

  methods: {
    acceptSuggestionEdit: function () {
      this.$emit("acceptSuggestionEdit");
      this.ready = false;
    },
    refuseSuggestionEdit: function (reason) {
      this.$emit("refuseSuggestionEdit", { reason });
      this.ready = false;
    },
  },
};
</script>

<style lang="scss">
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

  &.disabled {
    pointer-events: none;
    opacity: 0.4;
  }

  .item_label {
    suggestion {
      font-weight: bold;
    }
  }
}
</style>
