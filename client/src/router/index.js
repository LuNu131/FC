import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import Login from "../views/Login.vue";
import Dashboard from "../views/Dashboard.vue";
import PlayersList from "../views/PlayersList.vue";
import PlayerDetail from "../views/PlayerDetail.vue";
import Attendance from "../views/Attendance.vue";
import PlayerForm from "@/components/PlayerForm.vue";
import FundManagement from "@/views/FundManagement.vue";
import TeamSplitting from "@/views/TeamSplitting.vue";
import Profile from "../views/Profile.vue"; // IMPORT MỚI
import AdminTraits from "../views/AdminTraits.vue";

const routes = [
  { path: "/login", name: "Login", component: Login },
  {
    path: "/",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    meta: { requiresAuth: true },
  }, // ROUTE MỚI
  {
    path: "/players",
    name: "PlayersList",
    component: PlayersList,
    meta: { requiresAuth: true },
  },
  {
    path: "/players/:id",
    name: "PlayerDetail",
    component: PlayerDetail,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: "/players/new",
    name: "PlayerNew",
    component: PlayerForm,
    props: { isEditing: false },
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/players/:id/edit",
    name: "PlayerEdit",
    component: PlayerForm,
    props: (route) => ({ id: route.params.id, isEditing: true }),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/attendance",
    name: "Attendance",
    component: Attendance,
    meta: { requiresAuth: true },
  }, // Attendance ai cũng vào xem được, nhưng Admin mới có quyền tạo
  {
    path: "/fund",
    name: "FundManagement",
    component: FundManagement,
    meta: { requiresAuth: true },
  },
  {
    path: "/teams",
    name: "TeamSplitting",
    component: TeamSplitting,
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/traits",
    name: "AdminTraits",
    component: AdminTraits,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    return { top: 0 };
  },
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  if (!authStore.isAuthenticated && to.meta.requiresAuth) {
    next("/login");
  } else if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next("/");
  } else {
    next();
  }
});

export default router;
