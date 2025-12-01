import { defineStore } from "pinia";
import { ref } from "vue";
import axiosClient from "@/api/axiosClient";

export const usePlayerStore = defineStore("player", () => {
  const players = ref([]);
  const loading = ref(false);

  const fetchPlayers = async () => {
    loading.value = true;
    try {
      const res = await axiosClient.get("/players");
      players.value = res.data;
    } catch (err) {
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const getPlayerById = async (id) => {
    try {
      const res = await axiosClient.get(`/players/${id}`);
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  const createPlayer = async (data) => {
    await axiosClient.post("/players", data);
    await fetchPlayers();
  };

  const updatePlayer = async (id, data) => {
    await axiosClient.put(`/players/${id}`, data);
    await fetchPlayers();
  };

  const deletePlayer = async (id) => {
    await axiosClient.delete(`/players/${id}`);
    players.value = players.value.filter((p) => p.id != id);
  };

  return {
    players,
    loading,
    fetchPlayers,
    getPlayerById,
    createPlayer,
    updatePlayer,
    deletePlayer,
  };
});
