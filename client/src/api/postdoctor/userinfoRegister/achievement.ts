import fetch_postdoctor from '@/api/postdoctor';

const { raw } = fetch_postdoctor('/api');

// 获取入站前成果统计
export const getAchievementStatistics = async () => {
    const res = await raw.GET('/pre_entry_achievement/statistics');
    return res.data;
};
