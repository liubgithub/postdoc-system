import init_fetch from '@/api/fetch'

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export default function Token_fetch(base: string) {
    return init_fetch(base)
}