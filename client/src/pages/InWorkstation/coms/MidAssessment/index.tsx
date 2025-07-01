import Midform from "./midform.tsx"

export default defineComponent({
    name: "MidAssessment",
    setup() {
        return () => (
            <div>
                <h1>中期考核</h1>
                <Midform />
            </div>
        )
    }
})