from config.database import SessionLocal
from db_models.user_model import User
from security.password import hash_password


def seed_users():
    session = SessionLocal()

    try:
        # 🔥 Clear old users
        session.query(User).delete()

        # ✅ Only ADMIN user
        users = [
            User(
                username="admin",
                password_hash=hash_password("admin123"),
                role="ADMIN",
                is_active=True
            )
        ]

        session.add_all(users)
        session.commit()

        print("✅ Admin user inserted")

    except Exception as e:
        session.rollback()
        print("❌ Error:", e)

    finally:
        session.close()


if __name__ == "__main__":
    seed_users()