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

export const createBook = async (data: any) => {
  const res = await raw.POST('/pre_entry_book/', { body: data });
  return res.data;
};

export const updateBook = async (id: number, data: any) => {
  const res = await raw.PUT(`/pre_entry_book/{id}`, { params: { path: { id } }, body: data });
  return res.data;
};

export const deleteBook = async (id: number) => {
  const res = await raw.DELETE(`/pre_entry_book/{id}`, { params: { path: { id } } });
  return res.data;
}; 