def sync_achievement_count(db, user_id: int, category: str):
    from app.userinfoRegister.pre_entry_achievement import models
    table_map = {
        "项目信息": models.PreEntryProject,
        "竞赛获奖信息": models.PreEntryCompetitionAward,
        "新品种类型信息": models.PreEntryNewVariety,
        "课题研究信息": models.PreEntrySubjectResearch,
        "学术会议信息": models.PreEntryConference,
        "学术论文信息": models.PreEntryPaper,
        "著作信息": models.PreEntryBook,
        "专利信息": models.PreEntryPatent,
    }
    model = table_map.get(category)
    if not model:
        return
    count = db.query(model).filter(model.user_id == user_id).count()
    achievement = db.query(models.PreEntryAchievement).filter_by(user_id=user_id, category=category).first()
    if achievement:
        achievement.count = count
        db.commit() 