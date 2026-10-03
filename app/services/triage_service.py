from app.services.gmail_service import get_recent_emails
from app.services.ai_service import analyze_email
from app.database import get_cached_analysis, save_analysis


def triage_emails(limit=10):

    emails = get_recent_emails(limit)

    results = []

    for email in emails:

        email_id = email["id"]

        # Check if this email was already analyzed
        cached_analysis = get_cached_analysis(email_id)

        if cached_analysis:

            print(f"Using cached analysis: {email['subject']}")

            analysis = cached_analysis

        else:

            print(f"Analyzing with AI: {email['subject']}")

            analysis = analyze_email(
                sender=email["sender"],
                subject=email["subject"],
                body=email["body"]
            )

            # Save AI result
            save_analysis(
                email_id,
                analysis
            )

        results.append({
            "email": email,
            "analysis": analysis
        })

    return results