<template>
  <div :class="theme">
  <router-view >
  </router-view>
  <div id="theme-selector">
    <div id="title"><strong>Themes</strong></div>
    <ul>
      <li @click="setTheme('dlsu')">Green</li>
      <li @click="setTheme('ateneo')">Blue</li>
      <li @click="setTheme('ust')">Yellow</li>
      <li @click="setTheme('up')">Maroon</li>
    </ul>
  </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, h, markRaw } from 'vue'

const DefaultComponent = markRaw({
  render: () => h('div', 'Loading…')
})

type PageState = "Add"|"List"|"View"|"Edit"|"Preferences"

type AppState = {
  theme: string;
  state: PageState;
}

export default defineComponent({
  components: {
  },
  el: "#app",
  data() {
    return {
      theme: 'dlsu',
    } as AppState
  },
  methods: {
    setTheme(theme: string) {
      var wholeURL = new URL(window.location.toString());
      console.log(wholeURL);
      var searchParams = new URLSearchParams(wholeURL.search);
      searchParams.set('theme', theme);

      let newUrl = new URL(window.location.href);
      newUrl.search = searchParams as any;
      history.pushState({}, null, newUrl.toString());
      this.theme = `theme-${theme}`
      localStorage.setItem('theme', this.theme);
    }
  },
  created() {
      var wholeURL = new URL(window.location.toString());
      console.log(wholeURL);
      var searchParams = new URLSearchParams(wholeURL.search);

      console.log(searchParams);
      if (searchParams.has("theme") === false) {
        const theme = localStorage.getItem('theme');
        this.theme = theme || `theme-dlsu`
        return;
      };

      const theme = searchParams.get("theme");
      console.log(theme);
      const supportedThemes = [
        "dlsu",
        "ateneo",
        "ust",
        "up",
      ]

      if (supportedThemes.includes(theme)) {
        this.theme = `theme-${theme}`
        return;
      }

      this.theme = `theme-dlsu`
  },
})

</script>

<style>
@import url('./assets/styles.scss');

strong {
  margin: 20px;
}

ul {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  margin: 0 40%;
  justify-content: space-evenly;
}
li {
  cursor: pointer;
}
</style>
