import { env } from "$env/dynamic/private";
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
            let panit = await resPanit.json()
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
                
            
                console.log(formattedData)
                console.log(undangan)
                console.log(panit)
                return { data: formattedData, undangan: undangan, panit: panit, situs: situs };
           
        }
    }
    catch (e) {
        if (e instanceof Error) return console.log(e.message)
    }
};