from app.services.ai_service import analyze_email


def main():

    print("Testing Email Triage Agent AI...\n")

    result = analyze_email(
        sender="placement@example.com",
        subject="Campus Recruitment Registration",
        body="""
        Students interested in the upcoming campus recruitment drive
        must complete registration before Friday at 5 PM.
        Please submit the required documents through the placement portal.
        """
    )

    print("AI RESULT:")
    print("=" * 60)
    print(result)
    print("=" * 60)


if __name__ == "__main__":
    main()