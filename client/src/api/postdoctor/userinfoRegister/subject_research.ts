import fetch_postdoctor from '@/api/postdoctor';
const { raw } = fetch_postdoctor('/api');

export const getMySubjectResearches = async () => {
  const res = await raw.GET('/pre_entry_subject_research/me');
  return res.data;
};

export const getSubjectResearchById = async (id: number) => {
  const res = await raw.GET(`/pre_entry_subject_research/{id}`, { params: { path: { id } } });
  return res.data;
};

// 创建操作：使用 POST /pre_entry_subject_research/
export const uploadSubjectResearch = async (formData: FormData) => {
  const res = await raw.POST('/pre_entry_subject_research/', { body: formData as any });
  return res.data;
};

// 修改操作：使用 PUT /pre_entry_subject_research/{id}
export const updateSubjectResearch = async (id: number, formData: FormData) => {
  const res = await raw.PUT(`/pre_entry_subject_research/{id}`, { params: { path: { id } }, body: formData as any });
  return res.data;
};

export const deleteSubjectResearch = async (id: number) => {
  const res = await raw.DELETE(`/pre_entry_subject_research/{id}`, { params: { path: { id } } });
  return res.data;
}; 