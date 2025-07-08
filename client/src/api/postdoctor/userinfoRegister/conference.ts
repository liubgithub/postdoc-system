import fetch_postdoctor from '@/api/postdoctor';
const { raw } = fetch_postdoctor('/api');

export const getMyConferences = async () => {
    const res = await raw.GET('/pre_entry_conference/me');
    return res.data;
};

export const getConferenceById = async (id: number) => {
    const res = await raw.GET(`/pre_entry_conference/${id}`);
    return res.data;
};

export const createConference = async (data: any) => {
    const res = await raw.POST('/pre_entry_conference/', { body: data });
    return res.data;
};

export const updateConference = async (id: number, data: any) => {
    const res = await raw.PUT(`/pre_entry_conference/${id}`, { body: data });
    return res.data;
};

export const deleteConference = async (id: number) => {
    const res = await raw.DELETE(`/pre_entry_conference/${id}`);
    return res.data;
};