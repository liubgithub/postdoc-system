import fetch_postdoctor from '@/api/postdoctor';
const { raw } = fetch_postdoctor('/api');

export const getMyPapers = async () => {
  const res = await raw.GET('/pre_entry_paper/me');
  return res.data;
};

export const getPaperById = async (id: number) => {
  const res = await raw.GET(`/pre_entry_paper/{id}`, { params: { path: { id } } });
  return res.data;
};

// 创建操作统一用 uploadPaper（FormData），不再使用 createPaper
// export const createPaper = async (data: any) => {
//   const res = await raw.POST('/pre_entry_paper/', { body: data });
//   return res.data;
// };

// 修改操作也用 FormData，支持文件
export const updatePaper = async (id: number, formData: FormData) => {
  const res = await raw.PUT(`/pre_entry_paper/{id}`, { params: { path: { id } }, body: formData as any });
  return res.data;
};

export const deletePaper = async (id: number) => {
  const res = await raw.DELETE(`/pre_entry_paper/{id}`, { params: { path: { id } } });
  return res.data;
};

// 文件上传接口，创建和有文件的编辑都用这个
export const uploadPaper = async (formData: FormData) => {
  // @ts-ignore
  const res = await raw.POST('/pre_entry_paper/upload', { body: formData as any });
  return res.data;
};