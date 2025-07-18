import fetch_postdoctor from '@/api/postdoctor';
const { raw } = fetch_postdoctor('/api');

export const getMyNewVarieties = async () => {
  const res = await raw.GET('/pre_entry_new_variety/me');
  return res.data;
};

export const getNewVarietyById = async (id: number) => {
  const res = await raw.GET(`/pre_entry_new_variety/{id}`, { params: { path: { id } } });
  return res.data;
};

// 创建操作：使用 POST /pre_entry_new_variety/
export const uploadNewVariety = async (formData: FormData) => {
  const res = await raw.POST('/pre_entry_new_variety/', { body: formData as any });
  return res.data;
};

// 修改操作：使用 PUT /pre_entry_new_variety/{id}
export const updateNewVariety = async (id: number, formData: FormData) => {
  const res = await raw.PUT(`/pre_entry_new_variety/{id}`, { params: { path: { id } }, body: formData as any });
  return res.data;
};

export const deleteNewVariety = async (id: number) => {
  const res = await raw.DELETE(`/pre_entry_new_variety/{id}`, { params: { path: { id } } });
  return res.data;
}; 