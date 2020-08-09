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
              <DecisionButton
                v-if="readOnly"
                read-only
                :decision="getDecisionFromApplied(tile.suggestion.applied)"
                :decision-reason="tile.suggestion.appliedReason"
              />
              <b-btn-group v-else size="lg">
                <DecisionButton
                  v-for="decision in ['fix', 'skip', 'dontfix']"
                  :key="decision"
                  :decision="decision"
                  :ready="ready"
                  @apply-decision="$emit('apply-decision', $event)"
                />
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
import DecisionButton from "./DecisionButton";
import { mapState } from "vuex";

export default {
  name: "TileList",
  components: { DecisionButton, SuggestionDiff },
  props: {
    activeTile: Object,
    tiles: Array,
    readOnly: Boolean,
  },
  data: () => ({
    ready: false,
    pendingSubmitSuggestion: null,
  }),
  computed: {
    ...mapState(["refusalReasons"]),
  },
  methods: {
    getDecisionFromApplied(applied) {
      return applied === null ? "skip" : applied === true ? "fix" : "dontfix";
    },
  },
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
