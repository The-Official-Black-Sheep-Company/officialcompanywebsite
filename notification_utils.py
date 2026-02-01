import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import json
import logging
import os
import uuid
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Email Configuration
SMTP_SERVER = 'localhost'
SMTP_PORT = 25
SENDER_EMAIL = 'notifications@theofficialblacksheepcompany.com'
ADMIN_EMAIL = 'admin@theofficialblacksheepcompany.com'

MESSAGES_FILE = 'messages.json'

def save_message_to_json(subject, body, sender="System", recipient="Admin"):
    """Appends a new message to the messages.json file."""
    try:
        # Load existing messages
        messages = []
        if os.path.exists(MESSAGES_FILE):
            try:
                with open(MESSAGES_FILE, 'r') as f:
                    messages = json.load(f)
            except json.JSONDecodeError:
                messages = [] # corrupted file, start fresh

        # Create new message object
        new_msg = {
            "id": str(uuid.uuid4()),
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "from": sender,
            "to": recipient,
            "subject": subject,
            "body": body,
            "read": False
        }

        messages.insert(0, new_msg) # Prepend to show newest first

        # Save back to file
        with open(MESSAGES_FILE, 'w') as f:
            json.dump(messages, f, indent=4)
            
        logger.info(f"Message saved to {MESSAGES_FILE}")
        return True
    except Exception as e:
        logger.error(f"Failed to save message: {e}")
        return False

def send_email_notification(new_member_email, new_member_username):
    """Sends an email notification to the admin."""
    try:
        subject = f"New Member Signup: {new_member_username}"
        body = f"""
        New Member Alert!
        
        Username: {new_member_username}
        Email: {new_member_email}
        
        Please welcome them to the flock.
        """
        
        msg = MIMEMultipart()
        msg['From'] = SENDER_EMAIL
        msg['To'] = ADMIN_EMAIL
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'plain'))

        # Connect to local SMTP server (Postfix)
        try:
            server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
            server.send_message(msg)
            server.quit()
        except Exception as smtp_err:
             logger.warning(f"SMTP failed (expected if local postfix is off): {smtp_err}")
             # We don't fail the whole process if email is just down, we still want the portal message

        logger.info(f"Email notification attempted for {ADMIN_EMAIL}")
        return True, "Email attempt made"
    except Exception as e:
        logger.error(f"Failed in email logic: {e}")
        return False, str(e)

def notify_new_member(email, username):
    """Orchestrates all notifications."""
    # 1. Email (Best effort)
    email_success, email_msg = send_email_notification(email, username)
    
    # 2. Portal Message (Persistent Storage)
    subject = f"New Member: {username}"
    body = f"A new member has joined the flock!\nUsername: {username}\nEmail: {email}"
    msg_success = save_message_to_json(subject, body)
    
    return {
        "email": {"success": email_success, "message": email_msg},
        "portal_message": {"success": msg_success, "message": "Saved to ISMM"}
    }
