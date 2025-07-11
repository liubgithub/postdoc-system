import init_fetch from '@/api/fetch'

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export default function fetch_postdoctor(base: string) {
    return init_fetch(base)
}