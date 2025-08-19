from .verification_service import VerificationService

# 使用进程内存作为验证码存储（适合单进程/小规模场景）
verification_service = VerificationService(ttl_seconds=300)

