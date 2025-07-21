import createClient from "openapi-fetch"
import type { paths } from "../api"
import midwareToken from "./midware/token"

export type Fetcher = ReturnType<typeof init_fetch>["raw"]
export  function init_fetch(base: string) {
    const raw = createClient<paths>({
        baseUrl: base,
    })
    raw.use(midwareToken)
    return {
        raw,
    }
}

export function init_login(base: string) {
    const raw = createClient<paths>({
        baseUrl: base,
    })
    return {
        raw,
    }
}
