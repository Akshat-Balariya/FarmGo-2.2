"""Market price and watchlist models."""
from datetime import datetime
from backend.extensions import db


class MarketPrice(db.Model):
    __tablename__ = 'market_prices'

    id = db.Column(db.Integer, primary_key=True)
    crop_name = db.Column(db.String(100), nullable=False, index=True)
    district = db.Column(db.String(100), nullable=False, index=True)
    state = db.Column(db.String(100), nullable=False)
    modal_price = db.Column(db.Float, nullable=False)
    min_price = db.Column(db.Float, nullable=False)
    max_price = db.Column(db.Float, nullable=False)
    unit = db.Column(db.String(50), default='Quintal')
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'crop_name': self.crop_name,
            'district': self.district,
            'state': self.state,
            'modal_price': self.modal_price,
            'min_price': self.min_price,
            'max_price': self.max_price,
            'unit': self.unit,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }


class PriceWatchlist(db.Model):
    __tablename__ = 'price_watchlist'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    crop_name = db.Column(db.String(100), nullable=False, index=True)
    target_price = db.Column(db.Float, nullable=False)
    alert_enabled = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
