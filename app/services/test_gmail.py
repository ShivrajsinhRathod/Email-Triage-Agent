from gmail_service import get_recent_emails


def main():

    print("Fetching recent emails...\n")

    emails = get_recent_emails(5)

    print(f"Found {len(emails)} emails\n")

    for index, email in enumerate(emails, start=1):

        print("=" * 60)

        print(f"Email #{index}")
        print(f"From: {email['sender']}")
        print(f"Subject: {email['subject']}")
        print(f"Date: {email['date']}")

        body_preview = email["body"][:300]

        print(f"Body: {body_preview}")

    print("=" * 60)


if __name__ == "__main__":
    main()