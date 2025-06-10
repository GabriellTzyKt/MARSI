import { env } from "$env/dynamic/private";
import type { PageServerLoad } from "../../$types";

export const load: PageServerLoad = async ({params, cookies}) => {
    console.log(params)
    let token = cookies.get("userSession")? JSON.parse(cookies.get("userSession") as string): ''

    try {
        let res = await fetch(`${env.URL_KERAJAAN}/situs/${params.id}`);
        let resW = await fetch(`${env.URL_KERAJAAN}/situs/wisata?limit=600`);
        if (!res.ok) {
            throw new Error(`HTTP Error! Status: ${res.status}`);
        }
        if (!resW.ok) {
            throw new Error(`HTTP Error! Status: ${resW.status}`);
        }
        let situsData = await res.json();
        console.log("situsss", situsData)
        let wisataData = await resW.json();
       let wisataObj = wisataData.filter((item: any) => {
                 return item.deleted_at == '0001-01-01T00:00:00Z' || !item.deleted_at;
            }  ).find((item) => item.id_wisata === situsData.id_wisata);

        let wisata = wisataObj ? wisataObj.nama_wisata : "-";
     
        console.log("wisataaa", wisata)
        let profileUrl: any = ""
       
        if (situsData.profile !== "") {
            try {
               

                    console.log(`Fetching document with ID: ${situsData.profile}`);
                    const docRes = await fetch(`${env.URL_KERAJAAN}/doc/${situsData.profile}`);

                    if (docRes.ok) {
                        const docData = await docRes.json();
                        console.log("Document data:", docData);

                        if (docData.file_dokumentasi) {
                            const imageUrl = `${env.URL_KERAJAAN}/file?file_path=${encodeURIComponent(docData.file_dokumentasi)}`;
                            profileUrl = imageUrl
                        }
                    } else {
                        console.error(`Failed to fetch document ${docId}: ${docRes.statusText}`);
                    }
            
            } catch (error) {
                console.error("Error processing image URLs:", error);
            }
        }
       
        let [resjk, respl, respb] = await Promise.all([
            fetch(`${env.PUB_PORT}/user/${situsData.juru_kunci}`),
            fetch(`${env.PUB_PORT}/user/${situsData.pelindung}`),
            fetch(`${env.PUB_PORT}/user/${situsData.pembina}`),
      ])
        let jk = await resjk.json()
        console.log("jk", jk)
        let pl = await respl.json()
        console.log("pl", pl)
        let pb = await respb.json()
        console.log("pb", pb)
        let final = {
            ...situsData,
            wisata,
           
            profileUrl,
            juru_kunci_nama: jk.nama_lengkap||"-",
            pelindung_nama: pl.nama_lengkap||"-",
            pembina_nama: pb.nama_lengkap||"-"
        }
        console.log(final)
        return { data: final };
    } catch (error) {
        
    }
};