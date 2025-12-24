import { NextRequest, NextResponse } from 'next/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY || '';

const SYSTEM_PROMPT = `You are HITROO's AI assistant. Be natural, conversational, and human-like.

CONVERSATION RULES:
- If someone says "hi" or "hello", respond naturally with a greeting back.
- Match the user's energy and tone.
- Keep responses to 1-2 sentences max.
- NO emojis. Professional but friendly.
- Weave in HITROO naturally when relevant, never forced.
- Don't sound scripted or robotic.

HITROO CONTEXT (use when relevant):
- "Intelligence, Unbound" - Founded by Rohit
- 100+ projects, 5+ products

PRODUCTS:
- Capsona: Voice-to-text flagship (coming soon)
- Attyn: AI task management
- Belecure: Lighting design tool (with Lightscape)
- Mockello: Student-industry hiring platform
- AI Marketing Agent: Multi-platform automation

SERVICES: Industrial automation, robotics, drones, vision systems, AI/ML, app dev, web dev, DevOps

When appropriate, encourage exploring HITROO or getting early access - but only when it fits the conversation naturally.`;

// Keywords that indicate user wants to create/build something OR contact us
const INTENT_KEYWORDS = [
    // Creation intent
    'build', 'create', 'develop', 'make', 'want', 'need', 'looking for',
    'can you help', 'help me', 'i want to', 'i need', 'we need', 'we want',
    'project', 'app', 'website', 'robot', 'automation', 'drone', 'ai',
    'machine learning', 'software', 'system', 'platform', 'solution',
    'hire', 'work with', 'partner', 'collaborate', 'consult',
    // Contact intent
    'contact', 'reach', 'connect', 'call', 'phone', 'email', 'talk',
    'discuss', 'meeting', 'schedule', 'get in touch', 'speak', 'chat with',
    'how can i contact', 'how to contact', 'reach out', 'get back to me',
    'callback', 'call back', 'interested', 'enquiry', 'inquiry', 'quote'
];

function detectIntent(message: string): boolean {
    const lowerMessage = message.toLowerCase();
    return INTENT_KEYWORDS.some(keyword => lowerMessage.includes(keyword));
}

export async function POST(request: NextRequest) {
    try {
        const { message } = await request.json();

        if (!message || typeof message !== 'string') {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            );
        }

        // Detect if user wants to create something or contact us
        const wantsToCreate = detectIntent(message);

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'openai/gpt-oss-120b',
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    { role: 'user', content: message }
                ],
                temperature: 0.7,
                max_completion_tokens: 100,
                top_p: 1,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Groq API error:', response.status, errorText);
            return NextResponse.json(
                { error: 'AI service temporarily unavailable' },
                { status: 500 }
            );
        }

        const data = await response.json();
        const aiResponse = data.choices?.[0]?.message?.content?.trim() || 'HITROO is building the future of intelligent systems. Get early access to be part of it.';

        return NextResponse.json({
            response: aiResponse,
            wantsToCreate,
            context: wantsToCreate ? message : undefined
        });
    } catch (error) {
        console.error('Chat API error:', error);
        return NextResponse.json(
            { error: 'Connection error. Please try again.' },
            { status: 500 }
        );
    }
}
