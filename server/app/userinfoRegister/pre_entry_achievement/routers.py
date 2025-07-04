from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.dependencies import get_db, get_current_user
from app.models.user import User
from ..pre_entry_book.models import PreEntryBook
from ..pre_entry_competition_award.models import PreEntryCompetitionAward
from ..pre_entry_conference.models import PreEntryConference
from ..pre_entry_new_variety.models import PreEntryNewVariety
from ..pre_entry_paper.models import PreEntryPaper
from ..pre_entry_patent.models import PreEntryPatent
from ..pre_entry_project.models import PreEntryProject
from ..pre_entry_subject_research.models import PreEntrySubjectResearch

router = APIRouter()

@router.get("/pre_entry_achievement/statistics")
def get_achievement_statistics(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    category_model_map = {
        "学术会议信息": PreEntryConference,
        "学术论文": PreEntryPaper,
        "专利信息": PreEntryPatent,
        "著作信息": PreEntryBook,
        "参与项目信息": PreEntryProject,
        "科技竞赛获奖信息": PreEntryCompetitionAward,
        "课题研究信息": PreEntrySubjectResearch,
        "新品种类型信息": PreEntryNewVariety,
    }
    result = []
    for category, model in category_model_map.items():
        count = db.query(model).filter(model.user_id == current_user.id).count()
        result.append({"category": category, "count": count})
    return result 