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

export const createProject = async (data: any) => {
  const res = await raw.POST('/pre_entry_project/', { body: data });
  return res.data;
};

export const updateProject = async (id: number, data: any) => {
  const res = await raw.PUT(`/pre_entry_project/{id}`, { params: { path: { id } }, body: data });
  return res.data;
};

export const deleteProject = async (id: number) => {
  const res = await raw.DELETE(`/pre_entry_project/{id}`, { params: { path: { id } } });
  return res.data;
};