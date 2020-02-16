<template>
  <div class="html-diff" v-html="htmlDiff"></div>
</template>
<script>
import axios from "axios";
import DiffMatchPatch, {
  DIFF_DELETE,
  DIFF_EQUAL,
  DIFF_INSERT
} from "diff-match-patch";

const diffToHtml = function(diffs) {
  const html = [];
  const pattern_amp = /&/g;
  const pattern_lt = /</g;
  const pattern_gt = />/g;
  const pattern_para = /\n/g;
  for (let x = 0; x < diffs.length; x++) {
    const op = diffs[x][0]; // Operation (insert, delete, equal)
    const data = diffs[x][1]; // Text of change.
    const text = data
      .replace(pattern_amp, "&amp;")
      .replace(pattern_lt, "&lt;")
      .replace(pattern_gt, "&gt;")
      .replace(pattern_para, "<br>");
    switch (op) {
      case DIFF_INSERT:
        html[x] = `<ins>${text}</ins>`;
        break;
      case DIFF_DELETE:
        html[x] = `<del>${text}</del>`;
        break;
      case DIFF_EQUAL:
        html[x] = `<span>${text}</span>`;
        break;
    }
  }
  return html.join("");
};

export default {
  name: "SuggestionDiff",
  props: {
    suggestionId: {}
  },

  data() {
    return {
      htmlDiff: ""
    };
  },

  mounted() {
    let vm = this;
    axios
      .get(
        `http://localhost:8081/v2/wikipedia/suggestion?suggestion_id=${vm.suggestionId}`
      )
      .then(({ data }) => {
        const dmp = new DiffMatchPatch();
        let diff = dmp.diff_main(data.originalWikitext, data.suggestedWikitext);
        dmp.diff_cleanupSemantic(diff);
        vm.htmlDiff = diffToHtml(diff);
        this.$emit("suggestion-diff-loaded");
      })
      .catch(() => {
        vm.error =
          "Something wrong occurred while fetching the suggestion details";
      });
  }
};
</script>

<style lang="scss">
.html-diff {
  ins {
    background: #e6ffe6;
  }
  del {
    background: #ffe6e6;
  }
}
</style>
