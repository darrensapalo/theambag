<template>
  <div :class="theme">
    <AddCause v-if="state === 'Add'"></AddCause>
    <ListCauses v-if="state === 'List'"></ListCauses>
    <ViewCause :causeID="causeID" v-if="state === 'View'"></ViewCause>
    <EditCause v-if="state === 'Edit'"></EditCause>
    <Preferences v-if="state === 'Preferences'"></Preferences>
    <template v-if="false">
      <hr>
      <strong>Debug</strong>
      <p>Current route: {{ currentRoute }}</p>
    </template>
  </div>
</template>

<script lang="ts">
import ListCauses from './components/ListCauses.vue'
import AddCause from './components/AddCause.vue'
import ViewCause from './components/ViewCause.vue'
import Preferences from './components/Preferences.vue'
import EditCause from './components/EditCause.vue'
import { defineComponent } from 'vue'

type PageState = "Add"|"List"|"View"|"Edit"|"Preferences"

type AppState = {
  currentRoute: string;
  state: PageState;
}

export default defineComponent({
  components: {
    AddCause,
    ListCauses,
    ViewCause,
    EditCause,
    Preferences,
  },
  el: "#app",
  data() {
    return {
      currentRoute: window.location.pathname,
    } as AppState
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
    state(): PageState {
      const location = window.location.pathname;
      const hasCauses = location.startsWith("/causes");
      const hasCausesOnly = location === "/causes" || location === "/causes/";
      const hasEdit = location.includes("/edit");

      if (location === "/") 
        return "Add"; 

      if (location.includes("preferences"))
        return "Preferences";

      if (hasCauses && hasEdit)
        return "Edit";

      if (hasCauses && hasCausesOnly)
        return "List";

      return "View";
    },
    causeID(): string|null {
      const location = window.location.pathname;
      const getID = location.replace(`/causes/`, "");
      
      if (getID !== null && getID !== undefined && getID !== "")
        return getID;

      return null;
    }
  }
})

</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Cabin&family=Fredoka+One&family=Staatliches&display=swap');

#app {
  font-family: Cabin, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--font-color);
  margin-top: 3rem;
}
body {
  margin: 0;
}

html {
  background-color: var(--color-accent);
}

.text-primary {
  font-family: Cabin, Helvetica, Arial, sans-serif;
}

.text-secondary {
  font-family: 'Fredoka One', cursive;
}

.text-tertiary {
  font-family: 'Staatliches', cursive;
}

h1 { font-size: 2.2rem; }

h2 { font-size: 1.8rem; }

h3 { font-size: 1.4rem; }

h4 { font-size: 1.2rem; }

h5 { font-size: 1.1rem; }

.header {
  font-family: 'Staatliches', cursive;
}

:root {
  --color-light: rgb(231, 231, 231);
}

.theme-dlsu {
  --color-primary: #308107;
  --color-secondary: #8dd453;
  --color-accent: #e2e2e2;
  --font-color: #091f0d;
}

.theme-ateneo {
  --color-primary: #0D659D;
  --color-secondary: #93c4e9;
  --color-accent: #e2e2e2;
  --font-color: #050B1F;
}

.theme-ust {
  --color-primary: #b89d03;
  --color-secondary: #f5cc02;
  --color-accent: #e2e2e2;
  --font-color: #3d3d3f;
}

.theme-up {
  --color-primary: #500e09;
  --color-secondary: #bd3537;
  --color-accent: #e2e2e2;
  --font-color: #5F7950;
}

.section {
  margin: 0 20px 3rem 20px;
  text-align: left;
}

</style>
