import {NextResponse } from 'next/server';

export async function GET(){
    try{
        // The model list is public; the key is only sent when configured.
        const headers = { "Content-Type": "application/json" };
        if(process.env.OPENROUTER_API_KEY){
            headers.Authorization = `Bearer ${process.env.OPENROUTER_API_KEY}`;
        }

        const response = await fetch("https://openrouter.ai/api/v1/models",{
            method: 'GET',
            headers,
            next: { revalidate: 3600 },
        });

        if(!response.ok){
            throw new Error(`OpenRouter API Error: ${response.status}`)
        }
        const data = await response.json();

        const formattedModels = data.data.map(model => ({
            id : model.id,
            name: model.name,
            // Long descriptions dominate the payload; the list clamps them to two lines anyway.
            description: model.description?.length > 600 ? `${model.description.slice(0, 600).trimEnd()}…` : model.description,
            context_length: model.context_length,
            architecture: model.architecture,
            pricing: model.pricing,
            top_provider: model.top_provider,
        }))

        // Same list for everyone: let the browser and any CDN reuse it.
        return NextResponse.json(
            { models: formattedModels },
            { headers: { "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400" } }
        );
    }catch(error){
        console.error("Error fetching models:",error);

        return NextResponse.json(
            {
                success: false,
                error: error.message || "Failed to fetch models",
            },
            {status: 500}
        );
    }
}
