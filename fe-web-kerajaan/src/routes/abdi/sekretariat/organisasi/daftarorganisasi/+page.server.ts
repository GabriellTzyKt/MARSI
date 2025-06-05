import { env } from "$env/dynamic/private";
import { error, fail, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { formatDatetoUI } from "$lib";

export const load: PageServerLoad = async ({fetch, cookies}) => {
    const token = cookies.get("userSession")? JSON.parse(cookies.get("userSession") as string): ''
    try {
        let organisasiResponse = await fetch(`${env.URL_KERAJAAN}/organisasi?limit=500`);
        if (!organisasiResponse.ok) {
            throw error(organisasiResponse.status, `Failed to fetch Organisasi: ${organisasiResponse.statusText}`);
        }
        console.log("Respon org",organisasiResponse)
        let organisasiList = await organisasiResponse.json();
        console.log("Organisasi : ", organisasiList);   
        
        organisasiList = organisasiList.filter((doc: any) => {
            return doc.deleted_at == '0001-01-01T00:00:00Z' && doc.deleted_at !== null;
        });
        let finalwithuser = await Promise.all(organisasiList.map(async (item: any) => { 
           
            try {
                    if (item.penanggung_jawab) {
                        let userResponse = await fetch(`${env.URL_KERAJAAN}/anggota/${item.penanggung_jawab}`,{
                         
                        });
                        let pembinaRes = await fetch(`${env.URL_KERAJAAN}/anggota/${item.pembina}`, {
                           
                        });
                        let pelindungres = await fetch(`${env.URL_KERAJAAN}/anggota/${item.pelindung}`, {
                            
                        });
                        if (userResponse.ok) {
                            let userData = await userResponse.json();
                            let pembina = await pembinaRes.json();
                            let pelindung = await pelindungres.json();
                            return {
                                ...item,
                                pembina_nama: pembina.nama_lengkap || `User ${item.pembina}`,
                                tanggal_berdiri: formatDatetoUI(item.tanggal_berdiri),
                                pelindung_nama: pelindung.nama_lengkap ||  `User ${item.pelindung}`,
                                penanggung_jawab_nama: userData.nama_lengkap || `User ${item.penanggung_jawab}`
                            };
                        }
                    }
        
                } catch (userError) {

                }
            
        }));
           console.log("Data Final : ", finalwithuser);
        return {
            finalwithuser, token: token?.token, organisasiList: organisasiList, cookies: cookies.get("userSession") as string,
        }
    } catch (error) {
        
    }
};
export const actions: Actions = {
    deleteOrganisasi: async ({ request }) => {
        const data = await request.formData()
        const id = data.get("id_organisasi")
        try {
            const res = await fetch(`${env.URL_KERAJAAN}/organisasi/${id}`, {
                method: "DELETE"
            })
            if (!res.ok) {
                throw new Error(`HTTP Error! Status: ${res.status}`);
            }
            const data = await res.json();
            console.log(data)
            return { success: true };
        }
        catch (error) {
            console.error("Error deleting record:", error);
            return fail(500, { error: "Server error when deleting record" });
        }
    }

};