import type { Middleware } from "openapi-fetch"

const midwareToken: Middleware = {
    async onRequest({ request }) {
        const token = localStorage.getItem('token')
        token && request.headers.set("Authorization", `Bearer ${token}`)
    }
}
export default midwareToken