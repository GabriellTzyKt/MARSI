export const load: PageServerLoad = async () => {
    try {
        const res = await fetch(`${env.BASE_URL_8008}/tugas`, {
            method: 'GET',
            headers: {
                Accept: 'application/json'
            }
        });

        if (res.ok) {
            const data = await res.json();
            
            // Format tanggal_mulai untuk semua item
            const formattedData = data.map((item: any) => ({
                ...item,
                tanggal_penugasan: item.tanggal_penugasan ? item.tanggal_penugasan.split('T')[0] : item.tanggal_penugasan
            }));
            
            console.log(formattedData);
            return { data: formattedData }
        }
    } catch (error) { 
        console.error('Error fetching data:', error);
        return { data: [] };
    }
};