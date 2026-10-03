import os
import base64

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build


SCOPES = [
    "https://www.googleapis.com/auth/gmail.readonly"
]


BASE_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "../..")
)

CREDENTIALS_FILE = os.path.join(BASE_DIR, "credentials.json")
TOKEN_FILE = os.path.join(BASE_DIR, "token.json")


def get_gmail_service():
    credentials = None

    if os.path.exists(TOKEN_FILE):
        credentials = Credentials.from_authorized_user_file(
            TOKEN_FILE,
            SCOPES
        )

    if not credentials or not credentials.valid:

        if (
            credentials
            and credentials.expired
            and credentials.refresh_token
        ):
            credentials.refresh(Request())

        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                CREDENTIALS_FILE,
                SCOPES
            )

            credentials = flow.run_local_server(port=0)

        with open(TOKEN_FILE, "w") as token:
            token.write(credentials.to_json())

    return build(
        "gmail",
        "v1",
        credentials=credentials
    )


def get_recent_emails(max_results=10):
    service = get_gmail_service()

    results = service.users().messages().list(
        userId="me",
        maxResults=max_results
    ).execute()

    messages = results.get("messages", [])

    emails = []

    for message in messages:

        message_data = service.users().messages().get(
            userId="me",
            id=message["id"],
            format="full"
        ).execute()

        headers = message_data["payload"].get("headers", [])

        subject = ""
        sender = ""
        date = ""

        for header in headers:

            name = header["name"].lower()

            if name == "subject":
                subject = header["value"]

            elif name == "from":
                sender = header["value"]

            elif name == "date":
                date = header["value"]

        body = extract_email_body(
            message_data["payload"]
        )

        emails.append({
            "id": message["id"],
            "thread_id": message_data.get("threadId"),
            "sender": sender,
            "subject": subject,
            "date": date,
            "body": body
        })

    return emails


def extract_email_body(payload):
    body = ""

    if "parts" in payload:

        for part in payload["parts"]:

            if part["mimeType"] == "text/plain":

                data = part["body"].get("data")

                if data:
                    body += base64.urlsafe_b64decode(
                        data
                    ).decode(
                        "utf-8",
                        errors="ignore"
                    )

            elif "parts" in part:

                body += extract_email_body(part)

    else:

        data = payload.get("body", {}).get("data")

        if data:
            body = base64.urlsafe_b64decode(
                data
            ).decode(
                "utf-8",
                errors="ignore"
            )

    return body