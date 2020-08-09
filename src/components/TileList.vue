<template>
  <b-container>
    <b-row>
      <b-row
        class="gametitle"
        v-for="tile in tiles"
        :key="tile.suggestion.id"
        :class="{
          active: readOnly || activeTile.suggestion.id === tile.suggestion.id,
        }"
      >
        <b-col md="12" class="section">
          <div class="sec_text_title">
            <a class="external" target="_blank" :href="tile.article.url">
              {{ tile.article.title }}
              <b-badge>{{ tile.article.languageCode }}</b-badge>
            </a>
          </div>
          <div class="item_preview">
            <div class="item_label" v-html="tile.suggestion.message"></div>
            <div>
              <small>
                {{ tile.suggestion.ruleDescription }}
              </small>
              <SuggestionDiff
                v-if="
                  readOnly || tile.suggestion.id === activeTile.suggestion.id
                "
                :suggestion-id="tile.suggestion.id"
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
                  v-if="!readOnly || tile.suggestion.applied === true"
                  :disabled="readOnly"
                  size="lg"
                  variant="success"
                  @click="$emit('applyDecision', { decision: 'accept' })"
                  >Fix</b-btn
                >
                <b-btn
                  v-if="!readOnly || tile.suggestion.applied === null"
                  :disabled="readOnly"
                  size="lg"
                  variant="light"
                  @click="$emit('applyDecision', { decision: 'skip' })"
                  >Skip</b-btn
                >
                <b-btn
                  v-if="tile.suggestion.applied === false"
                  size="lg"
                  variant="primary"
                  disabled
                  >Do not fix<br />
                  <small
                    ><small>{{
                      refusalReasons[tile.suggestion.appliedReason]
                    }}</small></small
                  ></b-btn
                >
                <b-dropdown
                  v-else-if="!readOnly"
                  :disabled="
                    !(tile.suggestion.id === tile.suggestion.id && ready)
                  "
                  size="lg"
                  text="Do not fix"
                  variant="primary"
                >
                  <b-dropdown-item
                    v-for="(value, key) in refusalReasons"
                    :key="key"
                    @click="
                      $emit('applyDecision', {
                        decision: 'refuse',
                        reason: key,
                      })
                    "
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
  props: {
    activeTile: Object,
    tiles: Array,
    readOnly: Boolean,
  },
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
};
</script>

<style lang="scss">
.gametitle {
  border: 3px solid #888;
  border-radius: 10px;
  box-shadow: 10px 10px 5px #888;
  padding: 5px;
  min-height: 20px;
  width: 100%;
  margin: 20px 0 !important;

  a.external {
    font-size: 0.8em;
  }

  &.active {
    border: 3px solid #2966b8;
    color: #111111;
    background-color: #fffff8;

    a.external {
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

  .control {
    text-align: center;
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
