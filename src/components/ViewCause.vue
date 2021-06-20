<template>
  <div id="date" class="primary-section">
      <h3><span @click="viewList()" id="backButton">◂</span> &nbsp; {{ dateOfCause }}</h3>
  </div>
  <template v-if="cause !== null">
  <div @click="state = 'back'" v-show="state === 'front'">
    <div id="greeting" class="section">
      <h3>Hey,</h3>
      <h1 class="user-input text-secondary recipient-name">{{ cause.recipientName }}!</h1>
    </div>
    <div id="reason" class="section">
      <h3>We heard</h3>
      <h1 class="user-input text-secondary reason">{{ cause.reason }}</h1>
    </div>
    <div id="gift" class="section">
      <h3>So we decided to get you</h3>
      <h1 class="user-input text-secondary gift">{{ cause.gift }}</h1>
    </div>
    <div id="gang" class="section">
      <h3>Your gang,</h3>
      <h1 class="user-input text-secondary group-name">{{ cause.contributorGroupName }}</h1>
    </div>
  </div>
  <div @click="state = 'front'" v-show="state === 'back'">
    <div id="contributors">
      <label>With love,</label>
      <span class="contributor text-tertiary" v-for="contributor of cause.contributors" v-bind:key="contributor.name">
        {{ contributor.name }}
      </span>
    </div>
    <!-- <div id="actions">
      <div id="button-container" @click="joinContributors()">
      +
      </div>
    </div> -->
  </div>
  </template>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { Cause } from '../interfaces';
import { DBCause, MapDatabaseCause } from "../utils/cause-mapper";
import { isNullOrUndefined } from '../utils/object.utils';

export type PageState = "front"|"back"

export type PageData = {
  causeID: string;
  cause: Cause;
  state: PageState;
}

export default defineComponent({
  props: {
    causeID: String,
  },
  data() {
    return {
      cause: null,
      state: "front",
    } as PageData
  },
  methods: {
    joinContributors() {
      console.log("Join contributors");
    },
    viewList() {
      window.location.pathname = `/causes`;
    },
    async fetchCause(causeID: string): Promise<DBCause> {  
      const headers = new Headers();
      const DONT_LOOK = "4VpZOQmtNEPyw3IJGerL73XYCGFTd8ZEEu22RVstD3cQ5t01Khg6A1wi8WSe6vZv";
      headers.append("x-hasura-admin-secret", DONT_LOOK);

      const response = await fetch(`https://ambag.hasura.app/api/rest/causes/${causeID}`, {
        headers: headers
      })

      type GetCausesResponse = {
        causes_by_pk: DBCause;
      }

      console.log("Retrieving cause")
      const jsonData : GetCausesResponse = await response.json();
      console.log(jsonData);
      this.isLoading = false;
      return jsonData.causes_by_pk;
    }
  },
  computed: {
    dateOfCause(): string {
      if (isNullOrUndefined(this.cause)) return "";

      const date : Date = this.cause.date;

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
    gang() {

    }
  },
  async created() {
    if (!isNullOrUndefined(this.causeID)) {
      const causeResponse : DBCause = await this.fetchCause(this.causeID);
      console.log("cause data")
      console.log(causeResponse);
      this.cause = MapDatabaseCause(causeResponse);
      console.log(this.cause);
    }
  }
})
</script>

<style scoped>

.recipient-name {
  color: var(--color-light);
}

#backButton {
  cursor: pointer;
}

.reason {
  color: var(--color-light);
}
.gift {
  color: var(--color-secondary);
}
.group-name {
  color: var(--color-light);
}

.primary-section {
  padding: 0 1.5rem;
}

.section {
  background-color: var(--color-primary);
  color: var(--color-light);
  padding: 1rem ;
  border-radius: 10px;
  cursor: pointer;
}

#gift {

}

#date {
  margin-bottom: 2rem;
}

#contributors {
  display: flex;
  flex-direction: column;
  background-color: var(--color-primary);
  cursor: pointer;
}

#contributors label {
  margin: 1rem 0;
  color: var(--color-light);
  font-size: 1.2rem;
}

#contributors span {
  font-size: 3rem;
  text-transform: uppercase;
}

.contributor {
  color: var(--color-light);
  cursor: pointer;
}

.contributor:not(:last-child) {
  margin-bottom: 1rem;
}

.user-input {
  font-weight: 400;
}

#actions {
  display: flex;
  flex-direction: row;
  justify-content: center;
  position: relative;
  margin-top: 2rem;
  border: 0;
}

#button-container {
  cursor: pointer;
  color: var(--color-primary);
  line-height: 0.7;
  font-size: 5rem;
  width: 4rem;
  height: 4rem;
  margin: 0;
  padding: 0;
}

h1, h2, h3 {
  margin: 0;
  text-align: left;
}
</style>
