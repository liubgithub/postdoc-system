import createClient from "openapi-fetch"
import type { paths } from "../api"

export type Fetcher = ReturnType<typeof init_fetch>["raw"]
export default function init_fetch(base: string) {
    const raw = createClient<paths>({
        baseUrl: base,
    })
    return {
        raw,
    }
}
