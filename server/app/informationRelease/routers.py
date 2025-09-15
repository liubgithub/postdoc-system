from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from .models import InformationRelease
from .schemas import InformationReleaseIn, InformationReleaseOut
from typing import List

router = APIRouter(prefix="/information", tags=["信息发布"])

@router.post("/release", response_model=InformationReleaseOut, status_code=status.HTTP_201_CREATED)
def create_information_release(
    data: InformationReleaseIn,
    db: Session = Depends(get_db),
):
    """
    创建新的信息发布
    """
    # 检查必填字段
    if not data.newsName or not data.belongTo:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="新闻名称和所属类型不能为空"
        )
    
    # 创建新记录
    new_record = InformationRelease(
        newsName=data.newsName,
        belongTo=data.belongTo,  # 注意：模型中是belongTo，schema中是belongTo
        content=data.content
    )
    
    try:
        db.add(new_record)
        db.commit()
        db.refresh(new_record)
        return new_record
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"创建信息失败: {str(e)}"
        )

@router.get("/release", response_model=List[InformationReleaseOut])
def get_all_information_releases(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    """
    获取所有信息发布（支持分页）
    """
    records = db.query(InformationRelease).offset(skip).limit(limit).all()
    return records

@router.get("/release/{info_id}", response_model=InformationReleaseOut)
def get_information_release_by_id(
    info_id: int,
    db: Session = Depends(get_db),
):
    """
    根据ID获取特定信息发布
    """
    record = db.query(InformationRelease).filter(InformationRelease.id == info_id).first()
    
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"ID为 {info_id} 的信息不存在"
        )
    
    return record

@router.put("/release/{info_id}", response_model=InformationReleaseOut)
def update_information_release(
    info_id: int,
    data: InformationReleaseIn,
    db: Session = Depends(get_db),
):
    """
    更新信息发布
    """
    # 查找现有记录
    record = db.query(InformationRelease).filter(InformationRelease.id == info_id).first()
    
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"ID为 {info_id} 的信息不存在"
        )
    
    # 更新记录
    try:
        record.newsName = data.newsName
        record.belongTo = data.belongTo  # 注意字段名映射
        record.content = data.content
        
        db.commit()
        db.refresh(record)
        return record
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"更新信息失败: {str(e)}"
        )

@router.delete("/release/{info_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_information_release(
    info_id: int,
    db: Session = Depends(get_db),
):
    """
    删除信息发布
    """
    # 查找记录
    record = db.query(InformationRelease).filter(InformationRelease.id == info_id).first()
    
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"ID为 {info_id} 的信息不存在"
        )
    
    try:
        db.delete(record)
        db.commit()
        return None
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"删除信息失败: {str(e)}"
        )