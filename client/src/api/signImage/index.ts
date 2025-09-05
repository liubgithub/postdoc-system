//去掉强制json类型，能识别image
export const formFetchWithToken = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('token');
    const headers = new Headers(options.headers);

    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }
    // 如果是 FormData，让浏览器自动设置 Content-Type
    if (options.body instanceof FormData) {
        headers.delete('Content-Type');
    }

    return fetch(`/api${url}`, {
        ...options,
        headers
    });
};
