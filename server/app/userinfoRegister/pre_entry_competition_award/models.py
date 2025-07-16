from sqlalchemy import Column, Integer, String, DateTime
from app.database import Base
from datetime import datetime

class PreEntryCompetitionAward(Base):
    __tablename__ = "bs_pre_entry_competition_award"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    achievement_type = Column(Integer, default=0, index=True)  # 0: 入站前, 1: 在站
    竞赛名称 = Column(String(255))
    获奖类别 = Column(String(128))
    获奖等级 = Column(String(128))
    获奖时间 = Column(DateTime)
    本人署名 = Column(String(128))
    获奖级别 = Column(String(128))
    颁奖单位 = Column(String(255))
    第一完成单位 = Column(String(255))
    完成单位排名 = Column(String(128))
    是否和学位论文相关 = Column(String(32))  # 可用Boolean或String
    奖项名称 = Column(String(255))
    作者名单 = Column(String(255))
    上传获奖证书文件 = Column(String(255))  # 文件路径
    备注 = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
