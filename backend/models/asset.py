"""Asset health tracking and maintenance log models for the asset service."""
from datetime import datetime
from backend.extensions import db


class Asset(db.Model):
    """User-owned asset for health monitoring and predictive maintenance."""
    __tablename__ = 'assets'

    id = db.Column(db.Integer, primary_key=True)
    asset_id = db.Column(db.String(50), unique=True, nullable=False, index=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)

    asset_type = db.Column(db.String(50), nullable=False)
    asset_name = db.Column(db.String(200), nullable=False)
    manufacturer = db.Column(db.String(100))
    model = db.Column(db.String(100))
    serial_number = db.Column(db.String(100))

    purchase_date = db.Column(db.DateTime)
    purchase_price = db.Column(db.Float)

    health_score = db.Column(db.Float, default=100.0)
    status = db.Column(db.String(20), default='ACTIVE')
    alert_threshold_days = db.Column(db.Integer, default=7)

    last_telemetry = db.Column(db.Text)
    total_runtime_hours = db.Column(db.Float, default=0.0)
    last_maintenance_date = db.Column(db.DateTime)
    next_maintenance_due = db.Column(db.DateTime)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class MaintenanceLog(db.Model):
    """Maintenance log for an asset."""
    __tablename__ = 'maintenance_logs'

    id = db.Column(db.Integer, primary_key=True)
    log_id = db.Column(db.String(50), unique=True, nullable=False, index=True)
    asset_id = db.Column(db.Integer, db.ForeignKey('assets.id'), nullable=False, index=True)

    maintenance_type = db.Column(db.String(50), default='ROUTINE')
    description = db.Column(db.Text)
    parts_replaced = db.Column(db.Text)  # JSON array
    cost = db.Column(db.Float, default=0.0)

    pre_maintenance_health = db.Column(db.Float)
    post_maintenance_health = db.Column(db.Float)

    technician_name = db.Column(db.String(100))
    technician_notes = db.Column(db.Text)

    scheduled_date = db.Column(db.DateTime)
    completed_date = db.Column(db.DateTime)
    status = db.Column(db.String(20), default='SCHEDULED')

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
