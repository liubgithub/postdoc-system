import { defineStore } from "pinia";

export const useAchievementStore = defineStore("achievementStore", {
  state: () => ({
    achievements_count: 0,
  }),
  actions: {
    setTotalAchievements(count: number) {
      this.achievements_count = count;
    },
    getTotalAchievements() {
      return this.achievements_count;
    }
  },
});