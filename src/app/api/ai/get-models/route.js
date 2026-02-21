import {NextResponse } from 'next/server';

export async function GET(req){
    try{
        const response = await fetch("https://openrouter.ai/api/v1/models",{
            method: 'GET',
            headers:{
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            }
        });

        if(!response.ok){
            throw new Error(`OpenRouter API Error: ${response.status}`)
        }
        const data = await response.json();

        // Enable Claude Haiku 4.5 and all other models for all clients
        const allModels = data.data;

        const formattedModels = allModels.map(model => ({
            id : model.id,
            name: model.name,
            description: model.description,
            context_length: model.context_length,
            architecture: model.architecture,
            pricing: model.pricing,
            top_provider: model.top_provider,

        }))

        return NextResponse.json({
            models: formattedModels,
        });
    }catch(error){
        console.error("Error fetching free models:",error);

        return NextResponse.json(
            {
                success: false,
                error: error.message || " Failed to fetch free models",
            },
            {status: 500}
        );
    }
}