import fetch_postdoctor from '@/api/postdoctor';
const { raw } = fetch_postdoctor('/api');

export const getMyIndustryStandards = async () => {
  const res = await raw.GET('/pre_entry_industry_standard/me');
  return res.data;
};

export const getIndustryStandardById = async (id: number) => {
  const res = await raw.GET(`/pre_entry_industry_standard/{id}`, {params: { path: { id } }});
  return res.data;
};

export const createIndustryStandard = async (data: any) => {
  const res = await raw.POST('/pre_entry_industry_standard/', { body: data });
  return res.data;
};

export const updateIndustryStandard = async (id: number, data: any) => {
  const res = await raw.PUT(`/pre_entry_industry_standard/{id}`, { params: { path: { id } },body: data });
  return res.data;
};

export const deleteIndustryStandard = async (id: number) => {
  const res = await raw.DELETE(`/pre_entry_industry_standard/{id}`, {params: { path: { id } }});
  return res.data;
}; 