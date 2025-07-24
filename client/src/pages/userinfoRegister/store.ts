import { defineStore } from "pinia";


export const useAchievementStore = defineStore("achievementStore", {
  state: () => ({
    achievements_count: 0,
    paperList: [] as any[],
    patentList: [] as any[],
    awardList: [] as any[],
    projectList: [] as any[],
    conferenceList: [] as any[],
    bookList: [] as any[],
    standardList: [] as any[],
    varietyList: [] as any[],
    subjectResearchList: [] as any[],
  }),
  actions: {
    setTotalAchievements(count: number) {
      this.achievements_count = count;
    },
    getTotalAchievements() {
      return this.achievements_count;
    },
    setPaperList(list: any[]) {
      this.paperList = list;
    },
    setPatentList(list: any[]) {
      this.patentList = list;
    },
    setAwardList(list: any[]) {
      this.awardList = list;
    },
    setProjectList(list: any[]) {
      this.projectList = list;
    },
    setConferenceList(list: any[]) {
      this.conferenceList = list;
    },
    setBookList(list: any[]) {
      this.bookList = list;
    },
    setStandardList(list: any[]) {
      this.standardList = list;
    },
    setVarietyList(list: any[]) {
      this.varietyList = list;
    },
    setSubjectResearchList(list: any[]) {
      this.subjectResearchList = list;
    }
  },
});