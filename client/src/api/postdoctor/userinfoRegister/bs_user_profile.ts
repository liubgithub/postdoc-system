import fetch_postdoctor from '@/api/postdoctor';

const { raw } = fetch_postdoctor('/api');

// 获取当前用户个人信息
export const getUserProfile = async () => {
    const res = await raw.GET('/info/me');
    return res.data;
};

// 新增或更新（upsert）个人信息
export const submitUserProfile = async (data: any) => {
    const res = await raw.POST('/info/submit', { body: data });
    return res.data;
};

// // 修改当前用户个人信息
// export const updateUserProfile = async (data: any) => {
//     const res = await raw.PUT('/info/me', { body: data });
//     return res.data;
// };

// // 删除当前用户个人信息
// export const deleteUserProfile = async () => {
//     const res = await raw.DELETE('/info/me');
//     return res.data;
// };

// 根据用户ID获取用户信息
export const getUserProfileById = async (userId: number) => {
    const res = await raw.GET('/info/user/{user_id}', { params: { path: { user_id: userId } } });
    return res.data;
};