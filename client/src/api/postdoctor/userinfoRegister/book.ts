import fetch_postdoctor from '@/api/postdoctor';
const { raw } = fetch_postdoctor('/api');

export const getMyBooks = async () => {
  const res = await raw.GET('/pre_entry_book/me');
  return res.data;
};

export const getBookById = async (id: number) => {
  const res = await raw.GET(`/pre_entry_book/{id}`, { params: { path: { id } } });
  return res.data;
};

// 创建操作统一用 uploadBook（FormData），不再使用 createBook
// export const createBook = async (data: any) => {
//   const res = await raw.POST('/pre_entry_book/', { body: data });
//   return res.data;
// };

// 修改操作也用 FormData，支持文件
export const updateBook = async (id: number, formData: FormData) => {
  // 推荐用 fetch，保证 multipart/form-data
  // const res = await fetch(`/api/pre_entry_book/${id}`, {
  //   method: 'PUT',
  //   body: formData,
  //   credentials: 'include'
  // });
  // return await res.json();
  // 或用 openapi-fetch（需 as any）：
  const res = await raw.PUT(`/pre_entry_book/{id}`, { params: { path: { id } }, body: formData as any });
  return res.data;
};

export const deleteBook = async (id: number) => {
  const res = await raw.DELETE(`/pre_entry_book/{id}`, { params: { path: { id } } });
  return res.data;
};

// 文件上传接口，创建和有文件的编辑都用这个
export const uploadBook = async (formData: FormData) => {
  const res = await raw.POST(`/pre_entry_book/upload`, { body: formData as any });
  return res.data;
}; 


// // 文件上传接口，创建和有文件的编辑都用这个
// export const uploadBook = async (formData: FormData) => {
//   const res = await fetch('/api/pre_entry_book/upload', {
//     method: 'POST',
//     body: formData,
//     credentials: 'include'
//   });
//   return await res.json();
// }; 