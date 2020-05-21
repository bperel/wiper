<template>
  <b-spinner v-if="!htmlDiff" label="Loading"></b-spinner>
  <iframe v-else :srcdoc="htmlDiff"></iframe>
</template>
<script>
import axios from "axios";
import DiffMatchPatch, {
  DIFF_DELETE,
  DIFF_EQUAL,
  DIFF_INSERT,
} from "diff-match-patch";
import { mapState } from "vuex";

const diffToHtml = (diffs) => {
  const pattern_amp = /&/g;
  const pattern_lt = /</g;
  const pattern_gt = />/g;
  const pattern_para = /\n/g;
  return diffs
    .map(([op, data]) => {
      const text = data
        .replace(pattern_amp, "&amp;")
        .replace(pattern_lt, "&lt;")
        .replace(pattern_gt, "&gt;")
        .replace(pattern_para, "<br>");
      switch (op) {
        case DIFF_INSERT:
          return `<ins>${text}</ins>`;
        case DIFF_DELETE:
          return `<del>${text}</del>`;
        case DIFF_EQUAL:
          return `<span>${text}</span>`;
      }
    })
    .join("");
};

const diffCssMarkup = '<link rel="stylesheet" href="diff.css" />';

String.prototype.toEscapedRegExp = function () {
  return new RegExp(this.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&"), "g");
};

export default {
  name: "SuggestionDiff",
  props: {
    suggestionId: {},
  },

  computed: mapState(["LANGUAGETOOL_ENDPOINT_ROOT"]),

  data() {
    return {
      htmlDiff: "",
    };
  },

  mounted() {
    let vm = this;
    axios
      .get(
        `${this.LANGUAGETOOL_ENDPOINT_ROOT}/suggestion?suggestion_id=${vm.suggestionId}`
      )
      .then(({ data }) => {
        const dmp = new DiffMatchPatch();
        let diff = dmp.diff_main(data.originalWikitext, data.suggestedWikitext);
        dmp.diff_cleanupSemantic(diff);
        vm.htmlDiff = diffToHtml(diff);
        if (data.originalHtml) {
          vm.htmlDiff = data.originalHtml
            .replace(data.originalWikitext.toEscapedRegExp(), vm.htmlDiff)
            .replace("</head>", `${diffCssMarkup}</head>`);
        } else {
          vm.htmlDiff = `<html><head>${diffCssMarkup}</head><body>${vm.htmlDiff}</body></html>`;
        }
        this.$emit("suggestion-diff-loaded");
      })
      .catch(() => {
        vm.error =
          "Something wrong occurred while fetching the suggestion details";
      });
  },
};
</script>

<style lang="scss">
iframe {
  width: 100%;
  height: 100%;
  border: 0;
}
</style>
