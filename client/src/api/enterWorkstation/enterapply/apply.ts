import Token_fetch from "@/api/enterWorkstation/index";

const { raw } = Token_fetch('/api')

//进站申请提交

export const postEnterApply = async (data: any) => {
    const res = await raw.POST('/enterWorkstation/apply', { body: data })
    return res.data
}

export const getEnterApply = async () => {
    const res = await raw.GET('/enterWorkstation/apply')
    return res.data
}