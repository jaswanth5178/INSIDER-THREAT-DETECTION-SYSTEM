import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# ===============================
# MODEL PATHS (KEEP ✅)
# ===============================
MODEL_DIR = os.path.join(BASE_DIR, "models")

ANOMALY_MODEL_PATH = os.path.join(
    MODEL_DIR, "anomaly", "isolation_forest.pkl"
)

SCALER_PATH = os.path.join(
    MODEL_DIR, "anomaly", "scaler.pkl"
)

# ===============================
# FEATURE LIST (VERY IMPORTANT ✅)
# ===============================
ANOMALY_FEATURES = [
    "logon_count", "file_count", "device_count", "email_count", "http_count",
    "total_activity",
    "logon_ratio", "file_ratio", "device_ratio", "email_ratio", "http_ratio",
    "logon_log", "file_log", "device_log", "email_log", "http_log",
    "high_file_activity", "high_http_activity",
    "behavior_deviation_score", "resource_access_score"
]



