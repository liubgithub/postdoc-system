import time
import random
import string
from typing import Dict, Tuple, Optional


class VerificationService:
    """简单的内存验证码服务（生产建议改为 Redis）"""

    def __init__(self, ttl_seconds: int = 300):
        self.ttl_seconds = ttl_seconds
        # key -> (code, expire_at)
        self._store: Dict[str, Tuple[str, float]] = {}

    def _now(self) -> float:
        return time.time()

    def _generate_code(self, length: int = 6) -> str:
        return ''.join(random.choices(string.digits, k=length))

    def issue_code(self, key: str, length: int = 6) -> str:
        code = self._generate_code(length)
        expire_at = self._now() + self.ttl_seconds
        self._store[key] = (code, expire_at)
        return code

    def verify_code(self, key: str, code: str, delete_on_success: bool = True) -> bool:
        item: Optional[Tuple[str, float]] = self._store.get(key)
        if not item:
            return False
        saved_code, expire_at = item
        if self._now() > expire_at:
            # expired
            self._store.pop(key, None)
            return False
        ok = (saved_code == code)
        if ok and delete_on_success:
            self._store.pop(key, None)
        return ok

    def mark_verified(self, key: str) -> None:
        expire_at = self._now() + self.ttl_seconds
        # 用固定标记记录通过验证的状态
        self._store[key] = ("VERIFIED", expire_at)

    def is_verified(self, key: str) -> bool:
        item: Optional[Tuple[str, float]] = self._store.get(key)
        if not item:
            return False
        saved_code, expire_at = item
        if self._now() > expire_at:
            self._store.pop(key, None)
            return False
        return saved_code == "VERIFIED"

