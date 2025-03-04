import { defineComponent } from "vue"

import Example from "@/coms/Example"

export default defineComponent({
  name: "Home",
  setup() {
    return () => (
      <>
        <Example msg="Test!"/>
      </>
    )
  }
})