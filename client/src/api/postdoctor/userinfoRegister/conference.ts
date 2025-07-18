import fetch_postdoctor from '@/api/postdoctor';
const { raw } = fetch_postdoctor('/api');

export const getMyConferences = async () => {
  const res = await raw.GET('/pre_entry_conference/me');
  return res.data;
};

export const getConferenceById = async (id: number) => {
  const res = await raw.GET(`/pre_entry_conference/{id}`, { params: { path: { id } } });
  return res.data;
};

// 创建操作：使用 POST /pre_entry_conference/
export const uploadConference = async (formData: FormData) => {
  const res = await raw.POST('/pre_entry_conference/', { body: formData as any });
  return res.data;
};

// 修改操作：使用 PUT /pre_entry_conference/{id}
export const updateConference = async (id: number, formData: FormData) => {
  const res = await raw.PUT(`/pre_entry_conference/{id}`, { params: { path: { id } }, body: formData as any });
  return res.data;
};

export const deleteConference = async (id: number) => {
  const res = await raw.DELETE(`/pre_entry_conference/{id}`, { params: { path: { id } } });
  return res.data;
};