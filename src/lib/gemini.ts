
const API_KEY =
  import.meta.env.VITE_OPENROUTER_API_KEY;

export async function askGemini(prompt: string) {
  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",

          "HTTP-Referer": "http://localhost:3001",
          "X-Title": "StudyTogether",
        },

        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",

          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    console.log("OPENROUTER:", data);

    if (!response.ok) {
      return (
        data?.error?.message ||
        "OpenRouter request failed."
      );
    }

    return (
      data?.choices?.[0]?.message?.content ||
      "No AI response."
    );

  } catch (err) {
    console.error(err);

    return "AI request failed.";
  }
}