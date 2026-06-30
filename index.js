export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Use POST", { status: 405 });
    }

    const body = await request.json();

    const prompt = `You are a premium web design agency assistant.

Return structured output:

HEADLINE (1 line)
SUBHEADLINE (1-2 lines)
SERVICES (3 bullet points)
PRICING (short value explanation)
CTA (strong buying sentence)

Business:
Name: ${body.name}
Type: ${body.business}
Goal: ${body.goal}`;

    const aiResponse = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: [
        { role: "system", content: "You output structured, conversion-focused website copy." },
        { role: "user", content: prompt }
      ]
    });

    const text = aiResponse.response || "";

    const sections = {
      headline: extract(text, "HEADLINE"),
      subheadline: extract(text, "SUBHEADLINE"),
      services: extract(text, "SERVICES"),
      pricing: extract(text, "PRICING"),
      cta: extract(text, "CTA")
    };

    return Response.json(sections);
  }
};

function extract(text, key) {
  const regex = new RegExp(key + "[:\\s]*([\\s\\S]*?)(?=\\n[A-Z ]+:|$)", "i");
  const match = text.match(regex);
  return match ? match[1].trim() : "";
}
