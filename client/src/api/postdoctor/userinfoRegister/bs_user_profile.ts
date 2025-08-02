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

// 根据用户ID获取用户信息（导师查看学生信息用）
// 注意：这个API端点可能不存在，需要后端实现
export const getUserProfileById = async (userId: number) => {
    // 暂时返回空数据，等待后端实现
    console.warn('getUserProfileById API 端点未实现');
    return null;
};