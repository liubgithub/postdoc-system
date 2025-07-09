import fetch_postdoctor from '@/api/postdoctor';
const { raw } = fetch_postdoctor('/api');

export const getMyCompetitionAwards = async () => {
  const res = await raw.GET('/pre_entry_competition_award/me');
  return res.data;
};

export const getCompetitionAwardById = async (id: number) => {
  const res = await raw.GET(`/pre_entry_competition_award/${id}`);
  return res.data;
};

export const createCompetitionAward = async (data: any) => {
  const res = await raw.POST('/pre_entry_competition_award/', { body: data });
  return res.data;
};

export const updateCompetitionAward = async (id: number, data: any) => {
  const res = await raw.PUT(`/pre_entry_competition_award/${id}`, { body: data });
  return res.data;
};

export const deleteCompetitionAward = async (id: number) => {
  const res = await raw.DELETE(`/pre_entry_competition_award/${id}`);
  return res.data;
}; 