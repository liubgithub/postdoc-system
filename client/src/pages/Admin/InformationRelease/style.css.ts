import { style } from "@vanilla-extract/css";

export const searchPart = style({
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "16px",
})

export const page = style({
    padding: "16px",
})

export const tableBox = style({
    background: "#fff",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
})