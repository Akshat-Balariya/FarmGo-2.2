import json
import os
from urllib.parse import urlencode
from urllib.request import urlopen
from backend.extensions.cache import cache
from backend.utils.logger import logger

class SchemeService:
    def __init__(self):
        self.data_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'schemes.json')
        self.data_gov_resource_id = os.environ.get(
            'DATA_GOV_SCHEME_RESOURCE_ID',
            '9ff194bf-654e-4e3d-9c6c-3eed75e39e72',
        )
        self.data_gov_api_key = os.environ.get(
            'DATA_GOV_API_KEY',
            '579b464db66ec23bdd000001c43ef34767ce496343897dfb1893102b',
        )

    def _infer_category(self, scheme_name):
        name = (scheme_name or '').lower()
        if any(keyword in name for keyword in ['bima', 'insurance']):
            return 'insurance'
        if any(keyword in name for keyword in ['kisan', 'subvention', 'credit', 'mandhan']):
            return 'financial-support'
        if any(keyword in name for keyword in ['price', 'aasha', 'support']):
            return 'market-support'
        return 'general'

    def _to_float(self, value):
        try:
            if value in (None, ''):
                return 0.0
            return float(value)
        except (ValueError, TypeError):
            return 0.0

    def _fetch_live_schemes_from_data_gov(self):
        params = urlencode(
            {
                'api-key': self.data_gov_api_key,
                'format': 'json',
                'limit': 100,
            }
        )
        url = f"https://api.data.gov.in/resource/{self.data_gov_resource_id}?{params}"
        with urlopen(url, timeout=20) as response:
            payload = json.loads(response.read().decode('utf-8'))

        if payload.get('status') != 'ok':
            raise RuntimeError(payload.get('message', 'Failed to fetch live schemes'))

        records = payload.get('records', [])
        updated_date = payload.get('updated_date')
        source_link = (
            "https://www.data.gov.in/resource/"
            "scheme-wise-details-funds-allocation-and-utilization-welfare-farmers-country-under"
        )

        schemes = []
        for record in records:
            name = record.get('name_of_schemes_description') or 'Agriculture Scheme'
            allocation = self._to_float(record.get('allocation', 0))
            spent = self._to_float(record.get('progessive_expenditure_upto__31_01_2025_', 0))
            pct = self._to_float(record.get('percetage_of_expenditure', 0))

            schemes.append(
                {
                    'name': name,
                    'desc': (
                        f"Allocation: INR {allocation:,.2f} | "
                        f"Expenditure: INR {spent:,.2f} | "
                        f"Utilization: {pct:.2f}%"
                    ),
                    'link': source_link,
                    'category': self._infer_category(name),
                    'updated_at': updated_date,
                    'source': 'data.gov.in',
                }
            )

        return schemes

    def get_all_schemes(self):
        """Fetch live schemes (preferred) with cache and local fallback."""
        cached_schemes = None
        try:
            cached_schemes = cache.get('all_agricultural_schemes')
        except Exception as e:
            logger.warning(f"Cache unavailable while reading schemes: {str(e)}")

        if cached_schemes:
            return cached_schemes

        # 1) Preferred: live data from data.gov.in
        try:
            schemes = self._fetch_live_schemes_from_data_gov()
            try:
                cache.set('all_agricultural_schemes', schemes, timeout=3600)
            except Exception as e:
                logger.warning(f"Cache unavailable while storing live schemes: {str(e)}")
            return schemes
        except Exception as e:
            logger.warning(f"Live schemes fetch failed, using local fallback: {str(e)}")

        # 2) Fallback: local JSON (if present)
        try:
            if not os.path.exists(self.data_path):
                return []
            
            with open(self.data_path, 'r', encoding='utf-8') as f:
                schemes = json.load(f)
            
            # Cache for 24 hours when cache backend is available.
            try:
                cache.set('all_agricultural_schemes', schemes, timeout=86400)
            except Exception as e:
                logger.warning(f"Cache unavailable while storing schemes: {str(e)}")
            return schemes
        except Exception as e:
            logger.error(f"Failed to load schemes: {str(e)}")
            return []

    def get_schemes_by_category(self, category):
        """Get schemes filtered by category with caching."""
        cache_key = f'schemes_cat_{category}'
        cached = None
        try:
            cached = cache.get(cache_key)
        except Exception as e:
            logger.warning(f"Cache unavailable while reading category schemes: {str(e)}")
        if cached:
            return cached

        all_schemes = self.get_all_schemes()
        filtered = [s for s in all_schemes if s.get('category') == category]
        
        try:
            cache.set(cache_key, filtered, timeout=3600)
        except Exception as e:
            logger.warning(f"Cache unavailable while storing category schemes: {str(e)}")
        return filtered

    def invalidate_cache(self):
        """Invalidate schemes cache (e.g. after update)."""
        try:
            cache.delete('all_agricultural_schemes')
        except Exception as e:
            logger.warning(f"Cache unavailable while invalidating schemes cache: {str(e)}")
        logger.info("Agricultural schemes cache invalidated")

scheme_service = SchemeService()
