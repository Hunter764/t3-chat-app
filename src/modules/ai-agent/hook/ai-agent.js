import {useQuery} from '@tanstack/react-query';

export const useAIModels = () => {
    return useQuery({
        queryKey: ["ai-models"],
        queryFn: async () => {
            const res = await fetch("/api/ai/get-models");
            if(!res.ok) throw new Error("Failed to load models");
            return res.json();
        },
        staleTime: 60 * 60 * 1000,
        gcTime: 24 * 60 * 60 * 1000,
        refetchOnWindowFocus: false,
    })
}
