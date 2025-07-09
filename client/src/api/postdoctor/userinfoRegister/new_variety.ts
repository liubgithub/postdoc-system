import fetch_postdoctor from '@/api/postdoctor';
const { raw } = fetch_postdoctor('/api');

export const getMyNewVarieties = async () => {
  const res = await raw.GET('/pre_entry_new_variety/me');
  return res.data;
};

export const getNewVarietyById = async (id: number) => {
  const res = await raw.GET(`/pre_entry_new_variety/${id}`);
  return res.data;
};

export const createNewVariety = async (data: any) => {
  const res = await raw.POST('/pre_entry_new_variety/', { body: data });
  return res.data;
};

export const updateNewVariety = async (id: number, data: any) => {
  const res = await raw.PUT(`/pre_entry_new_variety/${id}`, { body: data });
  return res.data;
};

export const deleteNewVariety = async (id: number) => {
  const res = await raw.DELETE(`/pre_entry_new_variety/${id}`);
  return res.data;
}; 