def sync_achievement_count(db, user_id: int, category: str):
    if category == "项目信息":
        from app.userinfoRegister.pre_entry_project.models import BsPreEntryProject as Model
    elif category == "竞赛获奖信息":
        from app.userinfoRegister.pre_entry_competition_award.models import BsPreEntryCompetitionAward as Model
    elif category == "新品种类型信息":
        from app.userinfoRegister.pre_entry_new_variety.models import BsPreEntryNewVariety as Model
    elif category == "课题研究信息":
        from app.userinfoRegister.pre_entry_subject_research.models import BsPreEntrySubjectResearch as Model
    elif category == "学术会议信息":
        from app.userinfoRegister.pre_entry_conference.models import BsPreEntryConference as Model
    elif category == "学术论文信息":
        from app.userinfoRegister.pre_entry_paper.models import BsPreEntryPaper as Model
    elif category == "著作信息":
        from app.userinfoRegister.pre_entry_book.models import BsPreEntryBook as Model
    elif category == "专利信息":
        from app.userinfoRegister.pre_entry_patent.models import BsPreEntryPatent as Model
    else:
        return
    count = db.query(Model).filter(Model.user_id == user_id).count()
    from app.userinfoRegister.pre_entry_achievement.models import BsPreEntryAchievement
    achievement = db.query(BsPreEntryAchievement).filter_by(user_id=user_id, category=category).first()
    if achievement:
        achievement.count = count
        db.commit()