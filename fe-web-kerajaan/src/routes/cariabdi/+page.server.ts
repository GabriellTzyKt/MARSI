export const load: PageServerLoad = async ({cookies}) => {
    const token = cookies.get("userSession") ? JSON.parse(cookies.get("userSession") as string) : '';
    try {
        let res = await fetch(`${env.URL_KERAJAAN}/users`)
        if (!res.ok) {
            throw new Error(`HTTP Error! Status: ${res.status}`);
        }
        let data = await res.json();
        data = data.filter((item: any) => {
            return item.deleted_at === '0001-01-01T00:00:00Z' || !item.deleted_at;
        });
        return {
            data}
    } catch (error) {
        console.error("Error fetching users:", error);
        // Handle the error appropriately, e.g., redirect or return an error message
        return { data: [] };
    }
    return {
        data: []
    };
};