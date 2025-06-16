import type { JSX } from "vue/jsx-runtime"

declare global {
    namespace JSX {
        type Element = JSX.Element
    }
}