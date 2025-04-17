import { fail, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
    logout: async ({request,  cookies}) => {
        try {
            const session =  cookies.get("userSession")
            if (!session) {
                
                cookies.delete("userSession", { path: "/" })
                return true
            }
           
            else {
                return fail(406,{error: "Cant Be Logged Off"})
            }
        }
        catch {
            
        }
    }
};