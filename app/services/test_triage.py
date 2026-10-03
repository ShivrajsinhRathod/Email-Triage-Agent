from app.database import initialize_database
from app.services.triage_service import triage_emails


def main():

    print("\nStarting Email Triage Agent...\n")

    initialize_database()

    results = triage_emails(5)

    print("\n" + "=" * 70)
    print("EMAIL TRIAGE RESULTS")
    print("=" * 70)

    for index, result in enumerate(results, start=1):

        email = result["email"]
        analysis = result["analysis"]

        print(f"\nEMAIL #{index}")
        print("-" * 70)

        print(f"From: {email['sender']}")
        print(f"Subject: {email['subject']}")
        print(f"Date: {email['date']}")

        print("\nAI ANALYSIS:")
        print(analysis)

        print("-" * 70)


if __name__ == "__main__":
    main()