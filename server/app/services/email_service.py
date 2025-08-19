from email.mime.text import MIMEText
from email.utils import formataddr
import smtplib
from typing import Optional
from ..config import settings


class EmailService:
    def __init__(self):
        self.host = settings.EMAIL_HOST
        self.port = settings.EMAIL_PORT
        self.use_ssl = settings.EMAIL_USE_SSL
        self.username = settings.EMAIL_USERNAME
        self.password = settings.EMAIL_PASSWORD
        self.sender = settings.EMAIL_FROM or self.username

    def send_text(self, to_email: str, subject: str, content: str, sender_name: Optional[str] = None):
        msg = MIMEText(content, 'plain', 'utf-8')
        msg['From'] = formataddr((sender_name or 'Postdoc System', self.sender))
        msg['To'] = to_email
        msg['Subject'] = subject

        if self.use_ssl:
            server = smtplib.SMTP_SSL(self.host, self.port)
        else:
            server = smtplib.SMTP(self.host, self.port)
            server.starttls()
        try:
            server.login(self.username, self.password)
            server.sendmail(self.sender, [to_email], msg.as_string())
        finally:
            server.quit()

