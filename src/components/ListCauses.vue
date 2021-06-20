<template>
  <div class="section">
    <h1 id="title">Be thoughtful</h1>
  </div>
    <div id="contributions" class="section">
      <div @click="viewCause(cause.id)" class="contribution" v-for="cause of causes" v-bind:key="cause.id">
        <h3 class="date text-primary">{{ dateOfCause(cause) }}</h3>
        <h1 class="greeting text-tertiary">Hey, {{ cause.recipientName }}!</h1>
      </div>
    </div>
     <div id="actions">
      <div id="make-new-cause" @click="makeNewCause()">
      Make ambag
      </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Cause } from '../interfaces';
import { DBCause, MapDatabaseCause } from '../utils/cause-mapper';
import { isNullOrUndefined } from '../utils/object.utils';

type PageData = {
  causes: Cause[];
}

export default defineComponent({
  props: {
    causeID: String,
  },
  data() {
    return {
      causes: [],
      isLoading: true,
    } as PageData
  },
  methods: {
    viewCause(id: string) {
      window.location.pathname = `/causes/${id}`
    },
    dateOfCause(cause: Cause) {
      if (isNullOrUndefined(cause)) return "";
      if (isNullOrUndefined(cause.date)) return "";

      const date : Date = cause.date;

      function join(t, a, s) {
        function format(m) {
            let f = new Intl.DateTimeFormat('en', m);
            return f.format(t);
        }
        return a.map(format).join(s);
      }

      let a = [{month: 'long'}, {day: 'numeric'}, {year: 'numeric'}];
      return join(new Date, a, ' ');
    },
    makeNewCause() {
      window.location.pathname = `/`
    }
  },
  computed: {
    
  },
  async created() {

    this.isLoading = true;

    console.log("Loading data from hasura");

    const headers = new Headers();
    const DONT_LOOK = "4VpZOQmtNEPyw3IJGerL73XYCGFTd8ZEEu22RVstD3cQ5t01Khg6A1wi8WSe6vZv";
    headers.append("x-hasura-admin-secret", DONT_LOOK);

    const response = await fetch("https://ambag.hasura.app/api/rest/causes", {
      headers: headers
    })

    type GetCausesResponse = {
      causes: DBCause[];
    }

    const jsonData : GetCausesResponse = await response.json();

    this.isLoading = false;
    this.causes = jsonData.causes.map(MapDatabaseCause);

  }
})
</script>

<style scoped>
#contributions {
  margin: 1rem;
  text-align: left;
}

#title {
  color: var(--color-primary);
}

.contribution:not(:last-child) {
  margin-bottom: 1rem;
}

.contribution {
  background-color: var(--color-accent);
  padding: 16px;
  border-radius: 5px;
  cursor: pointer;
}
.date {
  color: var(--color-secondary);
  margin: 0rem;
}
.greeting {
  margin: 0;
  color: var(--color-primary);
}

#actions {
  display: flex;
  justify-content: center;
}

#make-new-cause {
  cursor: pointer;
  margin: 1rem 0;
  width: 40%;
  border-radius: 20px;
  padding: 16px;
  background-color: var(--color-primary);
  color: var(--color-light);
}
</style>
