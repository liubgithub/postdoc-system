import fetch_postdoctor from '@/api/postdoctor';
const { raw } = fetch_postdoctor('/api');

export const getMyPapers = async () => {
  const res = await raw.GET('/pre_entry_paper/me');
  return res.data;
};

export const getPaperById = async (id: number) => {
  const res = await raw.GET(`/pre_entry_paper/{id}`, { params: { path: { id } } });
  return res.data;
};

// 创建操作：使用 POST /pre_entry_paper/
export const uploadPaper = async (formData: FormData) => {
  const res = await raw.POST('/pre_entry_paper/', { body: formData as any });
  return res.data;
};

// 修改操作：使用 PUT /pre_entry_paper/{id}
export const updatePaper = async (id: number, formData: FormData) => {
  const res = await raw.PUT(`/pre_entry_paper/{id}`, { params: { path: { id } }, body: formData as any });
  return res.data;
};

export const deletePaper = async (id: number) => {
  const res = await raw.DELETE(`/pre_entry_paper/{id}`, { params: { path: { id } } });
  return res.data;
};