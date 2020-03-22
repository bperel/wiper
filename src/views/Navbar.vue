<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <a class="navbar-brand" href="#">WiPeR</a>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto"></ul>
      <button v-if="username" class="btn btn-outline-info" disabled>
        {{ username }}
      </button>
      <button v-if="!username" class="btn" @click="$emit('initLogin')">
        Log in
      </button>
    </div>
  </nav>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Navbar",
  computed: mapState(["username"]),
};
</script>

<style scoped>
button[disabled] {
  cursor: initial;
}
</style>
