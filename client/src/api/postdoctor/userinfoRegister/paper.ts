import fetch_postdoctor from '@/api/postdoctor';
const { raw } = fetch_postdoctor('/api');

export const getMyPapers = async () => {
  const res = await raw.GET('/pre_entry_paper/me');
  return res.data;
};

export const getPaperById = async (id: number) => {
  const res = await raw.GET(`/pre_entry_paper/{id}`, {params: { path: { id } }});
  return res.data;
};

export const createPaper = async (data: any) => {
  const res = await raw.POST('/pre_entry_paper/', { body: data });
  return res.data;
};

export const updatePaper = async (id: number, data: any) => {
  const res = await raw.PUT(`/pre_entry_paper/{id}`, { params: { path: { id } }, body: data });
  return res.data;
};

export const deletePaper = async (id: number) => {
  const res = await raw.DELETE(`/pre_entry_paper/{id}`, {params: { path: { id } }});
  return res.data;
};