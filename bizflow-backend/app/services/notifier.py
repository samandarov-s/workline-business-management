from app import models
import logging

def send_email_notification(user_email: str, subject: str, message: str):
    # Placeholder: simulate sending email
    logging.info(f"Sending email to {user_email}: {subject} - {message}")
    # In production, integrate with SendGrid/Mailgun/SMTP
