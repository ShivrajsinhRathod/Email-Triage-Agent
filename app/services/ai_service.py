import os
import json

from dotenv import load_dotenv
from google import genai

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise ValueError(
        "GEMINI_API_KEY is not configured in .env"
    )

client = genai.Client(
    api_key=API_KEY
)


def analyze_email(sender, subject, body):

    prompt = f"""
You are the AI engine of an Email Triage Agent.

Analyze the following email.

EMAIL
FROM:
{sender}

SUBJECT:
{subject}

BODY:
{body}

Return ONLY valid JSON.

The JSON must have exactly these fields:

{{
  "category": "Important | Work | Academic | Personal | Promotional | Newsletter | Social | Security | Other",
  "priority": "Critical | High | Medium | Low",
  "requires_action": true,
  "summary": "A concise 1-2 sentence summary.",
  "reason": "Brief explanation for the priority."
}}

Rules:

1. Do not invent information.
2. Base the decision only on the email.
3. Consider deadlines, requests, security alerts, meetings,
   payments, applications and required responses.
4. Promotional emails should normally have Low priority unless
   they clearly require action.
5. requires_action must be either true or false.
6. Return JSON only.
7. Do not use markdown.
8. Do not add explanations outside the JSON.
"""

    interaction = client.interactions.create(
        model="gemini-3.8-flash",
        input=prompt
    )

    result = interaction.output_text.strip()

    try:
        return json.loads(result)

    except json.JSONDecodeError:
        print("AI returned invalid JSON:")
        print(result)

        return {
            "category": "Other",
            "priority": "Medium",
            "requires_action": False,
            "summary": "AI response could not be parsed.",
            "reason": "The AI returned an unexpected response format."
        }