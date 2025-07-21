import fetch_postdoctor from '@/api/postdoctor';
const { raw } = fetch_postdoctor('/api');

export const getMyIndustryStandards = async () => {
  const res = await raw.GET('/pre_entry_industry_standard/me');
  return res.data;
};

export const getIndustryStandardById = async (id: number) => {
  const res = await raw.GET(`/pre_entry_industry_standard/{id}`, { params: { path: { id } } });
  return res.data;
};

// 创建操作：使用 POST /pre_entry_industry_standard/
export const uploadIndustryStandard = async (formData: FormData) => {
  const res = await raw.POST('/pre_entry_industry_standard/', { body: formData as any });
  return res.data;
};

// 修改操作：使用 PUT /pre_entry_industry_standard/{id}
export const updateIndustryStandard = async (id: number, formData: FormData) => {
  const res = await raw.PUT(`/pre_entry_industry_standard/{id}`, { params: { path: { id } }, body: formData as any });
  return res.data;
};

export const deleteIndustryStandard = async (id: number) => {
  const res = await raw.DELETE(`/pre_entry_industry_standard/{id}`, { params: { path: { id } } });
  return res.data;
}; 