import fetch_postdoctor from '@/api/postdoctor';
const { raw } = fetch_postdoctor('/api');

export const getMyProjects = async () => {
  const res = await raw.GET('/pre_entry_project/me');
  return res.data;
};

export const getProjectById = async (id: number) => {
  const res = await raw.GET(`/pre_entry_project/{id}`, { params: { path: { id } } });
  return res.data;
};

// 创建操作：使用 POST /pre_entry_project/
export const uploadProject = async (formData: FormData) => {
  const res = await raw.POST('/pre_entry_project/', { body: formData as any });
  return res.data;
};

// 修改操作：使用 PUT /pre_entry_project/{id}
export const updateProject = async (id: number, formData: FormData) => {
  const res = await raw.PUT(`/pre_entry_project/{id}`, { params: { path: { id } }, body: formData as any });
  return res.data;
};

export const deleteProject = async (id: number) => {
  const res = await raw.DELETE(`/pre_entry_project/{id}`, { params: { path: { id } } });
  return res.data;
};