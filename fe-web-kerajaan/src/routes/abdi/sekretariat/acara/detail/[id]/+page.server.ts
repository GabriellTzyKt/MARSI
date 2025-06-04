import { env } from "$env/dynamic/private";
import { date } from "zod";
import type { PageServerLoad } from "../../$types";

export const load: PageServerLoad = async ({params, cookies}) => {
    try {
        let cook = JSON.parse(cookies.get("userSession") as string)
        let resSitus = await fetch(`${env.URL_KERAJAAN}/situs`);
        let res = await fetch(`${env.URL_KERAJAAN}/acara/detail/${params.id}`);
        let resUndangan = await fetch(`${env.URL_KERAJAAN}/undangan/${params.id}`);
        let resPanit = await fetch(`${env.URL_KERAJAAN}/acara/panitia/${params.id}`);
        console.log(res)
        if (res.ok && resUndangan.ok && resPanit.ok && resSitus.ok) {
            let data = await res.json()
            let undangan = await resUndangan.json()
            undangan = undangan.filter(item => item.deleted_at === '0001-01-01T00:00:00Z' || !item.deleted_at)
            let panit = await resPanit.json()
             panit = panit.filter(item => item.deleted_at === '0001-01-01T00:00:00Z' || !item.deleted_at)
            let situs = await resSitus.json()

            let resUser = await fetch(`${env.PUB_PORT}/user/${data?.id_penanggung_jawab}`, {
                headers: {
                    "Authorization" : `Bearer ${cook?.token}`
                }
            })
            let user = await resUser.json()

            console.log("Data User", user)
            let formatDate = (isoString) => {
                if (!isoString || isoString === '0001-01-01T00:00:00Z') return '-';
                let date = new Date(isoString);
                let day = String(date.getDate()).padStart(2, '0');
                let month = String(date.getMonth() + 1).padStart(2, '0');
            let year = date.getFullYear();
            return `${day}-${month}-${year}`;
            };
            let formatTime = (isoString) => {
                if (!isoString || isoString === '0001-01-01T00:00:00Z') return '-';
                let date = new Date(isoString);
                let hours = String(date.getHours()).padStart(2, '0');
                let minutes = String(date.getMinutes()).padStart(2, '0');
                return `${hours}:${minutes}`;
            };

            let formattedData = {
                    ...data,
                    tanggal_mulai: formatDate(data.waktu_mulai),
                    tanggal_selesai: formatDate(data.waktu_selesai),
                    waktu_mulai: formatTime(data.waktu_mulai),
                    waktu_selesai: formatTime(data.waktu_selesai),
                    waktu_mulai_original: data.waktu_mulai,
                waktu_selesai_original: data.waktu_selesai,
                    nama_penanggungjawab : user.nama_lengkap
                };
                
            function setjabatan(data) {
                switch (data) {
                    
                    case "ketua":
                        return "Ketua"
                        
                    case "wakilketua":
                        return "Wakil Ketua"
                    case "sekretariat":
                         return "Sekretariat"
                    case "bendahara":
                        return "Bendahara"
                    case "acara":
                         return "Acara"
                    case "komunikasi":
                         return "Komunikasi"
                    case "perlengkapan":
                         return "Perlengkapan"
                    case "pdd":
                         return "PDD"
                    case "keamanan":
                         return "Keamanan"
                    case "humas":
                        return "Humas"
                    default:
                        return data
                }
            }
            let undanganWithUser = await Promise.all(undangan.map(async (item) => { 
                try {
                    let resUser = await fetch(`${env.PUB_PORT}/user/${item.id_penerima}`, {
                        headers: {
                            "Authorization" : `Bearer ${cook?.token}`
                        }
                    })
                    if(resUser.ok) {
                        let user = await resUser.json()
                        return {
                            ...item,
                          
                            nama_penerima: user.nama_lengkap,
                            nomer_telepon: user.no_telp,
                            jenis_kelamin: user.jenis_kelamin
                        }
                    }
                    
                    else {
                       return {
                            ...item,
                            nama_penerima: "No User Found",
                            nomer_telepon: "-",
                            jenis_kelamin: "-"
                        }
                    }
                } catch (error) {
                    
                }
            }))
            let panitWithUser = await Promise.all(panit.map(async (item) => { 
                try {
                    let resUser = await fetch(`${env.PUB_PORT}/user/${item.id_user}`, {
                        headers: {
                            "Authorization" : `Bearer ${cook?.token}`
                        }
                    })
                    if(resUser.ok) {
                        let user = await resUser.json()
                        return {
                            ...item,
                              jabatan : setjabatan(item.jabatan_panitia),
                            nama_panit: user.nama_lengkap,
                           
                        }
                    }
                    
                    else {
                       return {
                            ...item,
                            nama_panit: "No User Found",
                            
                        }
                    }
                } catch (error) {
                    
                }
            }))
                console.log(formattedData)
                console.log(undangan)
            console.log(panit)
            
                return { data: formattedData, undangan: undanganWithUser, panit: panitWithUser, situs: situs };
           
        }
    }
    catch (e) {
        if (e instanceof Error) return console.log(e.message)
    }
};