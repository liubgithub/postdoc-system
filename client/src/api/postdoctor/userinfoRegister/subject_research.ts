import fetch_postdoctor from '@/api/postdoctor';
const { raw } = fetch_postdoctor('/api');

export const getMySubjectResearches = async () => {
  const res = await raw.GET('/pre_entry_subject_research/me');
  return res.data;
};

export const getSubjectResearchById = async (id: number) => {
  const res = await raw.GET(`/pre_entry_subject_research/${id}`);
  return res.data;
};

export const createSubjectResearch = async (data: any) => {
  const res = await raw.POST('/pre_entry_subject_research/', { body: data });
  return res.data;
};

export const updateSubjectResearch = async (id: number, data: any) => {
  const res = await raw.PUT(`/pre_entry_subject_research/${id}`, { body: data });
  return res.data;
};

export const deleteSubjectResearch = async (id: number) => {
  const res = await raw.DELETE(`/pre_entry_subject_research/${id}`);
  return res.data;
}; 