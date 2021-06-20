// router/index.ts
import { createRouter, createWebHistory } from "vue-router";
import AddCause from "../components/AddCause.vue";
import ViewCause from "../components/ViewCause.vue";
import ListCauses from "../components/ListCauses.vue";

const routes = [
  {
    path: "/add",
    name: "AddCause",
    component: AddCause,
  },
  {
    path: "/",
    name: "ListCauses",
    component: ListCauses,
  },
  {
    path: "/causes/:id",
    name: "ViewCause",
    component: ViewCause,
  },
];

const router = createRouter({
  routes: routes,
  history: createWebHistory(),
});
export default router;
