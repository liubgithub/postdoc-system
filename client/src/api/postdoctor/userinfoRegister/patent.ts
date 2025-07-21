import fetch_postdoctor from '@/api/postdoctor';
const { raw } = fetch_postdoctor('/api');

export const getMyPatents = async () => {
  const res = await raw.GET('/pre_entry_patent/me');
  return res.data;
};

export const getPatentById = async (id: number) => {
  const res = await raw.GET(`/pre_entry_patent/{id}`, { params: { path: { id } } });
  return res.data;
};

// 创建操作：使用 POST /pre_entry_patent/
export const uploadPatent = async (formData: FormData) => {
  const res = await raw.POST('/pre_entry_patent/', { body: formData as any });
  return res.data;
};

// 修改操作：使用 PUT /pre_entry_patent/{id}
export const updatePatent = async (id: number, formData: FormData) => {
  const res = await raw.PUT(`/pre_entry_patent/{id}`, { params: { path: { id } }, body: formData as any });
  return res.data;
};

export const deletePatent = async (id: number) => {
  const res = await raw.DELETE(`/pre_entry_patent/{id}`, { params: { path: { id } } });
  return res.data;
}; 