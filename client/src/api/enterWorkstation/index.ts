import init_fetch from '@/api/fetch'

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export default function Token_fetch(base: string) {
    const { raw } = init_fetch(base)
    function withToken(method: HttpMethod) {
        return (url: string, options: any = {}) => {
            const token = localStorage.getItem('token')
            return (raw[method] as any)(url, {
                ...options,
                headers: {
                    ...options.headers,
                    Authorization: token ? `Bearer ${token}` : undefined,
                }
            })
        }
    }
    return {
        raw: {
            GET: withToken("GET"),
            POST: withToken("POST"),
            PUT: withToken("PUT"),
            DELETE: withToken("DELETE"),
        }
    }
}