from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List, Dict, Any
from ...dependencies import get_db, get_current_user
from ...models.user import User

# 导入所有bs_pre_entry_表的模型
from ..pre_entry_book.models import PreEntryBook
from ..pre_entry_competition_award.models import PreEntryCompetitionAward
from ..pre_entry_conference.models import PreEntryConference
from ..pre_entry_new_variety.models import PreEntryNewVariety
from ..pre_entry_paper.models import PreEntryPaper
from ..pre_entry_patent.models import PreEntryPatent
from ..pre_entry_project.models import PreEntryProject
from ..pre_entry_subject_research.models import PreEntrySubjectResearch
from ..pre_entry_industry_standard.models import PreEntryIndustryStandard

router = APIRouter(prefix="/time-filter", tags=["时间过滤"])

# 定义所有bs_pre_entry_表及其模型
PRE_ENTRY_TABLES = [
    {
        "table_name": "bs_pre_entry_book",
        "model": PreEntryBook,
        "display_name": "著作"
    },
    {
        "table_name": "bs_pre_entry_competition_award", 
        "model": PreEntryCompetitionAward,
        "display_name": "竞赛获奖"
    },
    {
        "table_name": "bs_pre_entry_conference",
        "model": PreEntryConference,
        "display_name": "会议"
    },
    {
        "table_name": "bs_pre_entry_new_variety",
        "model": PreEntryNewVariety,
        "display_name": "新品种"
    },
    {
        "table_name": "bs_pre_entry_paper",
        "model": PreEntryPaper,
        "display_name": "论文"
    },
    {
        "table_name": "bs_pre_entry_patent",
        "model": PreEntryPatent,
        "display_name": "专利"
    },
    {
        "table_name": "bs_pre_entry_project",
        "model": PreEntryProject,
        "display_name": "项目"
    },
    {
        "table_name": "bs_pre_entry_subject_research",
        "model": PreEntrySubjectResearch,
        "display_name": "课题研究"
    },
    {
        "table_name": "bs_pre_entry_industry_standard",
        "model": PreEntryIndustryStandard,
        "display_name": "行业标准"
    }
]


def get_filtered_data(user_id: int, target_time: datetime, db: Session) -> Dict[str, Any]:
    """
    获取指定用户在指定时间之后的所有bs_pre_entry_表数据
    
    Args:
        user_id: 用户ID
        target_time: 目标时间
        db: 数据库会话
    
    Returns:
        包含所有表数据的字典
    """
    result = {}
    
    for table_info in PRE_ENTRY_TABLES:
        model = table_info["model"]
        table_name = table_info["table_name"]
        display_name = table_info["display_name"]
        
        try:
            # 所有表的time字段都是DateTime类型，统一处理
            query = db.query(model).filter(
                model.user_id == user_id,
                model.time > target_time
            )
            
            data = query.all()
            
            # 转换为字典格式
            data_list = []
            for item in data:
                item_dict = {}
                for column in model.__table__.columns:
                    value = getattr(item, column.name)
                    if isinstance(value, datetime):
                        value = value.isoformat()
                    item_dict[column.name] = value
                data_list.append(item_dict)
            
            result[table_name] = {
                "display_name": display_name,
                "count": len(data_list),
                "data": data_list
            }
            
        except Exception as e:
            result[table_name] = {
                "display_name": display_name,
                "count": 0,
                "data": [],
                "error": str(e)
            }
    
    return result

@router.get("/get-data-after-time", summary="获取指定时间后的数据")
async def get_data_after_time(
    target_time: datetime,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    获取当前用户在指定时间之后的所有bs_pre_entry_表数据
    
    Args:
        target_time: 目标时间（管理员审核时间）
        current_user: 当前用户
        db: 数据库会话
    
    Returns:
        包含所有表数据的字典
    """
    user_id = current_user.id
    result = get_filtered_data(user_id, target_time, db)
    
    return {
        "user_id": user_id,
        "target_time": target_time.isoformat(),
        "tables": result,
        "total_count": sum(table_info["count"] for table_info in result.values())
    }


@router.get("/get-data-by-user/{user_id}", summary="管理员获取指定用户的数据")
async def get_data_by_user(
    user_id: int,
    target_time: datetime,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    管理员获取指定用户在指定时间之后的所有bs_pre_entry_表数据
    
    Args:
        user_id: 目标用户ID
        target_time: 目标时间（管理员审核时间）
        current_user: 当前用户（需要管理员权限）
        db: 数据库会话
    
    Returns:
        包含所有表数据的字典
    """
    # 检查当前用户是否为管理员
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="需要管理员权限"
        )
    
    result = get_filtered_data(user_id, target_time, db)
    
    return {
        "user_id": user_id,
        "target_time": target_time.isoformat(),
        "tables": result,
        "total_count": sum(table_info["count"] for table_info in result.values())
    } 