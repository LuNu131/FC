import { defineStore } from "pinia";
import { ref } from "vue";
import axiosClient from "@/api/axiosClient";

export const useTeamStore = defineStore("team", () => {
  const teams = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchTeams = async () => {
    loading.value = true;
    error.value = null;
    try {
      const res = await axiosClient.get("/teams"); // API từ teamController
      teams.value = res.data;
    } catch (err) {
      error.value = "Không thể tải dữ liệu đội bóng.";
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  return { teams, loading, error, fetchTeams };
});
