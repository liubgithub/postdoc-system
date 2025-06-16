import init_fetch from "./fetch"

// export const base = "http://8.154.46.253:2345/" //Test
export const base = "http://127.0.0.1:8000/"

const fetch = init_fetch(base)
export default fetch