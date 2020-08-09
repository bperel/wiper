<template>
  <b-btn
    v-if="decision === 'fix'"
    :disabled="readOnly"
    :size="readOnly ? 'md' : 'lg'"
    variant="success"
    @click="$emit('apply-decision', { decision: 'accept' })"
    >Fix
  </b-btn>
  <b-btn
    v-else-if="decision === 'skip'"
    :disabled="readOnly"
    :size="readOnly ? 'md' : 'lg'"
    variant="light"
    @click="$emit('apply-decision', { decision: 'skip' })"
    >Skip
  </b-btn>
  <b-dropdown
    v-else-if="decision === 'dontfix' && !readOnly"
    :size="readOnly ? 'md' : 'lg'"
    text="Do not fix"
    variant="primary"
  >
    <b-dropdown-item
      v-for="(value, key) in refusalReasons"
      :key="key"
      @click="
        $emit('apply-decision', {
          decision: 'refuse',
          reason: key,
        })
      "
      >{{ value }}
    </b-dropdown-item>
  </b-dropdown>
  <b-btn v-else disabled :size="readOnly ? 'md' : 'lg'" variant="primary"
    >Do not fix<br />
    <small
      ><small>{{ refusalReasons[decisionReason] }}</small></small
    ></b-btn
  >
</template>
<script>
import { mapState } from "vuex";

export default {
  name: "DecisionButton",
  props: {
    readOnly: {
      type: Boolean,
      default: false,
    },
    ready: {
      type: Boolean,
      default: true,
    },
    decision: {
      type: String,
      default: null,
    },
    decisionReason: {
      type: String,
      default: null,
    },
  },
  computed: {
    ...mapState(["refusalReasons"]),
  },
};
</script>
