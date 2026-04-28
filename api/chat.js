export default async function handler(req, res) {
    // Add security headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'System Access Denied' });
    }

    const { message, history, userDosha } = req.body;
    const engineKey = process.env.GROQ_API_KEY;

    if (!engineKey) {
        return res.status(500).json({ error: 'Aura Core Engine not initialized' });
    }

    const auraContext = [
        {
            role: "system",
            content: `You are Aura, a warm and knowledgeable AI wellness assistant.
            PERSONALITY: Empathetic, calm, and professional. You use Ayurvedic as well as modern principles to guide users toward balance.
            
            USER DATA: The user's current dominant Dosha is: ${userDosha || 'Unknown'}.
            
            INSTRUCTIONS:
            1. MEDICAL SAFETY: If the user describes a serious injury, severe pain, or a medical emergency, you MUST immediately advise them to seek professional medical attention or emergency services. Do not suggest Ayurvedic remedies for acute emergencies.
            2. If the Dosha is known, naturally tailor your advice (foods, yoga, lifestyle) to balance that specific Dosha. 
            3. If the Dosha is 'Unknown', your primary goal is to naturally discover their type. Subtly ask diagnostic questions (body frame, digestion, sleep, mood) during the conversation.
            4. DYNAMIC PROFILING: If you become confident about the user's Dosha through conversation, you MUST update their profile by adding this tag at the very end of your message: [UPDATE_DOSHA: type] (replace 'type' with vata, pitta, or kapha).
            5. NATURAL CONVERSATION: Be a natural, human-like coach. Avoid repeating the same opening phrases. Do NOT mention the user's Dosha in every message; only reference it when it is genuinely relevant to the health topic being discussed.
            6. Keep responses warm, encouraging, and under 100 words.`
        }
    ];

    if (history && Array.isArray(history)) {
        history.forEach(msg => {
            auraContext.push({ role: msg.role, content: msg.content });
        });
    }

    auraContext.push({ role: "user", content: message });

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${engineKey}`
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: auraContext
            })
        });

        const engineOutput = await response.json();
        return res.status(200).json(engineOutput);

    } catch (error) {
        console.error('System Core Error:', error);
        return res.status(500).json({ error: 'Aura Connection Interrupted' });
    }
}
