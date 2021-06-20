<template>
    <div id="date" class="primary-section">
      <h3><span @click="viewList()" id="backButton">◂</span> &nbsp; {{ dateOfCause }}</h3>
  </div>
  <div class="primary-section">
  <h1>Front</h1>
  </div>
  <div>
    <div id="greeting" class="section">
      <h3>Hey,</h3>
      <input
        v-if="isEditing"
        v-model="cause.recipientName"
      >
      <h1 v-else class="user-input text-secondary recipient-name">{{ cause.recipientName }}!</h1>
    </div>
    <div id="reason" class="section">
      <h3>We heard</h3>
      <input
        v-if="isEditing"
        v-model="cause.reason"
      >
      <h1 v-else @click="isEditing=true" class="user-input text-secondary reason">{{ cause.reason }}</h1>
    </div>
    <div id="gift" class="section">
      <h3>So we decided to get you</h3>
      <input
        v-if="isEditing"
        v-model="cause.gift"
      >
      <h1 v-else @click="isEditing=true" class="user-input text-secondary gift">{{ cause.gift }}</h1>
    </div>
    <div id="gang" class="section">
      <h3>Your gang,</h3>
      <input
        v-if="isEditing"
        v-model="cause.contributorGroupName"
      >
      <h1 v-else @click="isEditing=true" class="user-input text-secondary group-name">{{ cause.contributorGroupName }}</h1>
    </div>
  </div>
  <div class="primary-section">
  <h1>Back</h1>
  </div>
  <div>
    <div id="contributors">
      <template v-if="cause.contributors.length > 0">
        <label>With love,</label>
        <div class="contributor text-tertiary" v-for="contributor of cause.contributors" v-bind:key="contributor.name">
        <span @click="removeContributor(contributor.name)">
          {{ contributor.name }}
          </span>
          <button class="remove-contributor" v-if="isEditing" @click="removeContributor(contributor.name)">
            Remove
          </button>
        
        </div>
      </template>
      <template v-else>
        <p class="text-tertiary" style="color: var(--color-light); margin: 20px;"><em>No contributors yet. Enter some friendly dudes and dudettes below.</em></p>
      </template>
      
      
        <div style="display: flex; flex-direction: column; margin: 1rem;" v-if="isEditing">
          <label>Add Contributor</label>
          <input @keyup.enter="addContributor($event.target.value); $event.target.value = ''" />
        </div>
      </div>
  <div class="primary-section" style="margin-top: 2rem;">
    <h1>Options</h1>
  </div>
    <div id="form-state">
      <button @click="isEditing=!isEditing">
        {{ isEditing ? "Preview mode" : "Edit mode" }}
      </button>
      <button v-if="!isEditing" @click="save()">
        Make ambag the contributions
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Cause } from '../interfaces';
import { DBContributor } from '../utils/cause-mapper';
import { isNullOrUndefined } from '../utils/object.utils';

export type PageData = {
  cause: Cause;
}

export default defineComponent({
  components: {
    
  },
  data() {
    return {
      isEditing: true,
      cause: {
        date: new Date(),
        recipientName: "",
        globalVisibilitySetting: "visible",
        gift: "",
        reason: "",
        contributorGroupName: "",
        contributors: [
        ]
      } as Cause,
    } as PageData
  },
  methods: {
    addContributor(contributor: string) {

      this.cause.contributors.push({
        amount: 0,
        cause: null,
        cause_id: null,
        id: null,
        name: contributor,
        preferred_frequency: null,
        preferred_reasons: null,
      } as DBContributor);
    },
    removeContributor(contributor: string) {
      this.cause.contributors = this.cause.contributors
        .filter(c => c.name !== contributor);
      
    },
    viewList() {
      this.$router.push('/');
    },

    async postCause(): Promise<string> {
      const postURL = "https://ambag.hasura.app/api/rest/causes";
      
      type AddCauseRequest = {
        recipientName: string;
        date: string;
        gift:string;
        groupName:string;
        reason:string;
        visibility:string;
      }

      type AddCauseResponse = {
        insert_causes_one: {
          id: string;
        }
      }

      const cause : Cause = this.cause;

      const requestBody : AddCauseRequest = {
        recipientName: cause.recipientName,
        date: cause.date.toISOString().substring(0, 10),
        gift: cause.gift,
        groupName: cause.contributorGroupName,
        reason: cause.reason,
        visibility: cause.globalVisibilitySetting
      };

      console.log(JSON.stringify(requestBody, null, 2));

      const response : AddCauseResponse = await postData(postURL, requestBody)
      return response.insert_causes_one.id;
    },

    async postContributor(contributor: DBContributor): Promise<string> {
      const postURL = "https://ambag.hasura.app/api/rest/contributors";
      
      type AddContributorRequest = DBContributor;

      type AddContributorResponse = {
        insert_contributors_one: {
          id: string;
        }
      }

      const response : AddContributorResponse = await postData(postURL, {
        contributor
      })
      return response.insert_contributors_one.id;
    },

    async save() {
      const causeID = await this.postCause();
      console.log(`Created new cause ${causeID}`)

      const contributors = this.cause.contributors;

      for (let i = 0; i < contributors.length; i++) {
        const contributor : DBContributor = contributors[i];
        contributor.cause_id = causeID;
        const contributorID = await this.postContributor(contributor);
        console.log(`Created new contributor ${contributorID}`)
      }

      this.finish(causeID);

    },
    finish(causeID: string) {
      this.$router.push(`/causes/${causeID}`);
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
  created() {

  }
})
const DONT_LOOK = "4VpZOQmtNEPyw3IJGerL73XYCGFTd8ZEEu22RVstD3cQ5t01Khg6A1wi8WSe6vZv";
// Example POST method implementation:
async function postData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      'x-hasura-admin-secret': DONT_LOOK,
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}
</script>

<style scoped>
a {
  color: #42b983;
}
.contributor {
  display: flex;
  flex-direction: column;
}


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

.remove-contributor {
  margin: 0.5em 4em 2em 4em;
  padding: 10px;
}

h1, h2, h3 {
  margin: 0 auto;
  text-align: left;
}

input {
  margin: 1rem auto;
  padding: 8px;
  width: 80%;
  font-family: 'Fredoka One', cursive;
  font-size: 1.8rem;
  color: var(--font-color);
  border-radius: 10px;
}

label {
  font-weight: 800;
}

#form-state {
  margin-top: 2rem;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  
}

</style>
