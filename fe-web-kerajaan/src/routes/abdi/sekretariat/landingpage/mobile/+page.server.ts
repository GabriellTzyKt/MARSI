import { fail, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
    tambahMobile: async ({ request }) => {
        let errors: any[] = [];
        const data = await request.formData()
        const requiredFields = [
            "penanggalan",
            'tambahan_penanggalan',
            'pribadi',
            'acara',
            'situs_kerajaan',
            'check_in_situs',
            'acara_kerajaan',
            'grup_chat',
            'profil',
            'forum',
            'permohonan',
        ]

        requiredFields.forEach((f) => {
            if (!data.get(f)) {
                errors.push({[f]:`${f.replace(/_/g, " ")} Wajib Dipilih` })
            }
        })
        const penanggalan = data.get("penanggalan")
        const tambahan_penanggalan = data.get("tambahan_penanggalan")
        const pribadi = data.get("pribadi")
        const acara = data.get("acara")
        const situs_kerajaan = data.get("situs_kerajaan")
        const check_in_situs = data.get("check_in_situs")
        const acara_kerajaan = data.get("acara_kerajaan")
        const grup_chat = data.get("grup_chat")
        const profil = data.get("profil")
        const forum = data.get("forum")
        const permohonan = data.get("permohonan")
        if (errors) {
            return fail(418,{errors})
        }
        return {errors: "no Error"}
        console.log(data)
    }
};