import fetch_postdoctor from '@/api/postdoctor';
const { raw } = fetch_postdoctor('/api');

export const getMyCompetitionAwards = async () => {
  const res = await raw.GET('/pre_entry_competition_award/me');
  return res.data;
};

export const getCompetitionAwardById = async (id: number) => {
  const res = await raw.GET(`/pre_entry_competition_award/{id}`, { params: { path: { id } } });
  return res.data;
};

// 创建操作：使用 POST /pre_entry_competition_award/
export const uploadCompetitionAward = async (formData: FormData) => {
  const res = await raw.POST('/pre_entry_competition_award/', { body: formData as any });
  return res.data;
};

// 修改操作：使用 PUT /pre_entry_competition_award/{id}
export const updateCompetitionAward = async (id: number, formData: FormData) => {
  const res = await raw.PUT(`/pre_entry_competition_award/{id}`, { params: { path: { id } }, body: formData as any });
  return res.data;
};

export const deleteCompetitionAward = async (id: number) => {
  const res = await raw.DELETE(`/pre_entry_competition_award/{id}`, { params: { path: { id } } });
  return res.data;
}; 