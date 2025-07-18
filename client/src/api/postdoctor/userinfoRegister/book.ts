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

// 创建操作：使用 POST /pre_entry_book/
export const uploadBook = async (formData: FormData) => {
  const res = await raw.POST('/pre_entry_book/', { body: formData as any });
  return res.data;
};

// 修改操作：使用 PUT /pre_entry_book/{id}
export const updateBook = async (id: number, formData: FormData) => {
  const res = await raw.PUT(`/pre_entry_book/{id}`, { params: { path: { id } }, body: formData as any });
  return res.data;
};

export const deleteBook = async (id: number) => {
  const res = await raw.DELETE(`/pre_entry_book/{id}`, { params: { path: { id } } });
  return res.data;
};