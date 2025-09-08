import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY || "default_key"
});

export interface GenerateHooksRequest {
  topic: string;
  style: string;
  platform?: string;
  limit: number;
}

export interface GeneratedHook {
  style: string;
  content: string;
}

const HOOK_STYLES = {
  'bold-statement': 'Bold Statement - Start with a controversial or attention-grabbing statement',
  'relatable-pain': 'Relatable Pain - Address common struggles or frustrations your audience faces',
  'curiosity': 'Curiosity - Create mystery or intrigue that makes viewers want to know more',
  'transformation': 'Transformation - Show before/after scenarios or promise change',
  'storytelling': 'Storytelling - Begin with a personal story or narrative'
};

export async function generateViralHooks({ topic, style, platform, limit }: GenerateHooksRequest): Promise<GeneratedHook[]> {
  const styleDescription = HOOK_STYLES[style as keyof typeof HOOK_STYLES] || HOOK_STYLES['bold-statement'];
  
  const platformText = platform && platform !== 'all' ? 
    platform === 'tiktok' ? 'TikTok' :
    platform === 'instagram' ? 'Instagram Reels' :
    platform === 'youtube' ? 'YouTube Shorts' :
    'TikTok/Instagram Reels' : 'TikTok/Instagram Reels';
  
  const prompt = `Generate ${limit} viral hooks for ${platformText}.

Niche/Topic: ${topic}
Hook Style: ${styleDescription}

Requirements:
- Keep each hook under 12 words
- Make them viral and engaging
- Focus on ${styleDescription.toLowerCase()}
- Return as JSON array with format: [{"style": "${style}", "content": "hook text"}]

Examples of good viral hooks:
- "POV: You've been doing this wrong your whole life"
- "The secret nobody tells you about..."
- "When you realize everyone lied to you about..."
- "This changed everything for me..."
- "Nobody talks about this but..."

Generate ${limit} hooks now:`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a viral content expert specializing in TikTok and Instagram Reels hooks. Generate engaging, attention-grabbing hooks that drive maximum engagement. Respond only with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.9,
      max_tokens: 1000,
    });

    const result = JSON.parse(response.choices[0].message.content || '{"hooks": []}');
    
    // Handle different possible response formats
    const hooks = result.hooks || result || [];
    
    // Ensure we return the expected format
    return hooks.map((hook: any) => ({
      style: hook.style || style,
      content: hook.content || hook.text || hook
    })).slice(0, limit);

  } catch (error) {
    console.error("Error generating hooks:", error);
    throw new Error("Failed to generate viral hooks. Please try again.");
  }
}
