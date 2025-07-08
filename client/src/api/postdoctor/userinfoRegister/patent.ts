import fetch_postdoctor from '@/api/postdoctor';
const { raw } = fetch_postdoctor('/api');

export const getMyPatents = async () => {
  const res = await raw.GET('/pre_entry_patent/me');
  return res.data;
};

export const getPatentById = async (id: number) => {
  const res = await raw.GET(`/pre_entry_patent/${id}`);
  return res.data;
};

export const createPatent = async (data: any) => {
  const res = await raw.POST('/pre_entry_patent/', { body: data });
  return res.data;
};

export const updatePatent = async (id: number, data: any) => {
  const res = await raw.PUT(`/pre_entry_patent/${id}`, { body: data });
  return res.data;
};

export const deletePatent = async (id: number) => {
  const res = await raw.DELETE(`/pre_entry_patent/${id}`);
  return res.data;
}; 