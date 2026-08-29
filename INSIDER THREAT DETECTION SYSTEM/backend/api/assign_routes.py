from fastapi import APIRouter, BackgroundTasks
from pydantic import BaseModel
import smtplib
from email.mime.text import MIMEText
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()


# ✅ UPDATED MODEL
class AssignRequest(BaseModel):
    employee: str
    note: str


# 🔥 EMAIL FUNCTION (DECOUPLED)
def send_email(employee: str, note: str):
    subject = f"Employee {employee} Assigned for Review"

    body = f"""
Employee: {employee}

Admin Note:
{note}
"""

    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = os.getenv("ADMIN_EMAIL")
    msg["To"] = os.getenv("ANALYST_EMAIL")

    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(os.getenv("ADMIN_EMAIL"), os.getenv("ADMIN_PASS"))
        server.send_message(msg)
        server.quit()

        print("✅ Email sent successfully")

    except Exception as e:
        print("❌ Email Error:", e)


# 🔥 FASTAPI ROUTE (NON-BLOCKING)
@router.post("/assign")
def assign_to_analyst(req: AssignRequest, background_tasks: BackgroundTasks):

    # 👉 Run email in background (loose coupling ✅)
    background_tasks.add_task(send_email, req.employee, req.note)

    # 👉 Instant response
    return {
        "message": f"Employee {req.employee} assignment triggered 🚀 (email sending in background)"
    }