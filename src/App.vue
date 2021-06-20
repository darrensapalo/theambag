<template>
  <div :class="theme">
  <router-view >
  </router-view>
  </div>
</template>
<script lang="ts">
import ListCauses from './components/ListCauses.vue'
import AddCause from './components/AddCause.vue'
import ViewCause from './components/ViewCause.vue'
import Preferences from './components/Preferences.vue'
import EditCause from './components/EditCause.vue'
import { h, defineComponent, markRaw } from 'vue'
import routes from './routes';
import page from 'page';

const DefaultComponent = markRaw({
  render: () => h('div', 'Loading…')
})

type PageState = "Add"|"List"|"View"|"Edit"|"Preferences"

type AppState = {
  ViewComponent: any;
  state: PageState;
}

export default defineComponent({
  components: {
  },
  el: "#app",
  data() {
    return {
    } as AppState
  },
  created() {
    
  },
  computed: {
    theme(): string {
      var wholeURL = new URL(window.location.toString());
      console.log(wholeURL);
      var searchParams = new URLSearchParams(wholeURL.search);

      console.log(searchParams);
      if (searchParams.has("theme") === false) return "theme-dlsu";

      const theme = searchParams.get("theme");
      console.log(theme);
      const supportedThemes = [
        "dlsu",
        "ateneo",
        "ust",
        "up",
      ]

      if (supportedThemes.includes(theme)) return `theme-${theme}`;

      return "theme-dlsu"
    },
  
  }
})

</script>

<style>
@import url('./assets/styles.scss');
</style>
