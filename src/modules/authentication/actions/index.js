import { cache } from "react";
import { auth } from "@/lib/auth-server";

// Users live in Neon Auth (neon_auth schema), so the session is the source of truth.
// Server-only helper (not a server action): wrapped in cache() so the layout, the page and
// every data function in one request share a single session lookup.
export const currentUser = cache(async () => {
    try{
        const { data: session } = await auth.getSession();
        const user = session?.user;

        if(!user?.id){
            return null;
        }

        return {
            id: user.id,
            name: user.name ?? null,
            email: user.email ?? null,
            image: user.image ?? null,
            createdAt: user.createdAt ?? null,
            updatedAt: user.updatedAt ?? null,
        };
    }catch(error){
        console.error("Error in currentUser action:",error);
        return null;
    }
});
