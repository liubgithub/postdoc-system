# server/app/enterWorkstation/enterRelation/routers.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from .models import EnterRelation
from .schemas import EnterRelationBase, EnterRelationInDBBase
from app.models.user import User

router = APIRouter(
    prefix="/enterRelation",
    tags=["进站相关科研情况"]
)

@router.post("/", response_model=EnterRelationInDBBase)
def upsert_enter_relation(
    data: EnterRelationBase,
    db:Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    record = db.query(EnterRelation).filter_by(user_id=current_user.id).first()
    if record:
        update_data = data.dict(exclude_unset=True)
        for key,value in update_data.items():
            setattr(record,key,value)
        db.commit()
        db.refresh(record)
        return record
    else:
        record = EnterRelation(user_id = current_user.id, **data.dict())
        db.add(record)
        db.commit()
        db.refresh(record)
        return record


@router.get("/")
def get_relation(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        db_relation = db.query(EnterRelation).filter_by(user_id=current_user.id).first()
        if not db_relation:
            # 返回空对象而不是None，避免序列化错误
            return {
                "id": None,
                "user_id": current_user.id,
                "base_work": "",
                "necessity_analysis": "",
                "resplan_expected": "",
                "results": "",
                "other_achievements": "",
                "academic_pursuits": "",
                "created_at": None,
                "updated_at": None
            }
        return db_relation
    except Exception as e:
        print(f"获取当前用户的科研数据时发生错误: {e}")
        raise HTTPException(status_code=500, detail=f"获取数据失败: {str(e)}")


@router.delete("/")
def delete_relation(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_relation = db.query(EnterRelation).filter_by(user_id=current_user.id).first()
    if not db_relation:
        raise HTTPException(status_code=404, detail="未找到相关科研情况")
    db.delete(db_relation)
    db.commit()
    return {"msg": "deleted"}

# 根据用户ID获取进站申请数据
@router.get(
    "/user/{user_id}", 
    summary="根据用户ID获取进站申请的相关科研数据"
)
def get_relation_by_user_id(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        # 首先检查用户是否存在
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail=f"用户ID {user_id} 不存在")
        
        db_relation = db.query(EnterRelation).filter_by(user_id=user_id).first()
        if not db_relation:
            # 返回空对象而不是None，避免序列化错误
            return {
                "id": None,
                "user_id": user_id,
                "base_work": "",
                "necessity_analysis": "",
                "resplan_expected": "",
                "results": "",
                "other_achievements": "",
                "academic_pursuits": "",
                "created_at": None,
                "updated_at": None
            }
        return db_relation
    except HTTPException:
        raise
    except Exception as e:
        print(f"获取用户 {user_id} 的科研数据时发生错误: {e}")
        raise HTTPException(status_code=500, detail=f"获取数据失败: {str(e)}")