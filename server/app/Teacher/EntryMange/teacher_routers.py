from fastapi import APIRouter, Depends, HTTPException, Body, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.userinfoRegister.bs_user_profile.models import Info
from app.enterWorkstation.enterapply.models import EnterWorkstation
from app.enterWorkstation.enterAssessment.models import EnterAssessment
from app.postdocProcess.models import PostdocWorkflow, ProcessStatus, SupervisorStudent
from typing import List, Dict, Any
from datetime import datetime
from pydantic import BaseModel

# 导入科研成果相关的模型
from app.userinfoRegister.pre_entry_book.models import PreEntryBook
from app.userinfoRegister.pre_entry_competition_award.models import PreEntryCompetitionAward
from app.userinfoRegister.pre_entry_conference.models import PreEntryConference
from app.userinfoRegister.pre_entry_new_variety.models import PreEntryNewVariety
from app.userinfoRegister.pre_entry_paper.models import PreEntryPaper
from app.userinfoRegister.pre_entry_patent.models import PreEntryPatent
from app.userinfoRegister.pre_entry_project.models import PreEntryProject
from app.userinfoRegister.pre_entry_subject_research.models import PreEntrySubjectResearch
from app.userinfoRegister.pre_entry_industry_standard.models import PreEntryIndustryStandard

# 导入教育经历和工作经历相关的模型
from app.userinfoRegister.bs_user_profile.models import EducationExperience, WorkExperience

router = APIRouter(prefix="/entryMange/teacher", tags=["合作导师管理学生进站申请和进站考核"])

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

def get_student_achievement_data(user_id: int, db: Session) -> Dict[str, Any]:
    """
    获取指定学生的科研成果数据
    
    Args:
        user_id: 用户ID
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
            # 获取该用户的所有数据
            query = db.query(model).filter(model.user_id == user_id)
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

def get_student_education_work_data(user_profile_id: int, db: Session) -> Dict[str, Any]:
    """
    获取指定学生的教育经历和工作经历数据
    
    Args:
        user_profile_id: 用户档案ID (Info表的id)
        db: 数据库会话
    
    Returns:
        包含教育经历和工作经历数据的字典
    """
    result = {
        "education_experience": [],
        "work_experience": []
    }
    
    try:
        # 获取教育经历
        education_data = db.query(EducationExperience).filter(
            EducationExperience.user_id == user_profile_id
        ).all()
        
        for edu in education_data:
            result["education_experience"].append({
                "start_end": edu.start_end or "",
                "school_major": edu.school_major or "",
                "supervisor": edu.supervisor or ""
            })
        
        # 获取工作经历
        work_data = db.query(WorkExperience).filter(
            WorkExperience.user_id == user_profile_id
        ).all()
        
        for work in work_data:
            result["work_experience"].append({
                "start_end": work.start_end or "",
                "company_position": work.company_position or ""
            })
            
    except Exception as e:
        print(f"获取教育经历和工作经历数据失败: {str(e)}")
    
    return result

def get_workflow_status_info(workflow: PostdocWorkflow, postdoc: EnterWorkstation) -> Dict[str, Any]:
    """根据工作流状态获取状态信息"""
    if workflow:
        workflow_status = workflow.entry_application
        if workflow_status == "未提交":
            return {
                "status": "未提交",
                "node": "学生",
                "currentApproval": "学生未提交申请",
                "steps": [
                    {"status": "未开始", "role": "学生申请", "time": ""},
                    {"status": "等待中", "role": "导师审核", "time": ""},
                    {"status": "等待中", "role": "学院审核", "time": ""}
                ]
            }
        elif workflow_status == "导师未审核":
            return {
                "status": "审核中",
                "node": "合作导师",
                "currentApproval": "合作导师审核（待处理）",
                "steps": [
                    {"status": "已完成", "role": "学生申请", "time": postdoc.created_at.strftime("%Y-%m-%d %H:%M") if postdoc.created_at else ""},
                    {"status": "进行中", "role": "导师审核", "time": ""},
                    {"status": "等待中", "role": "学院审核", "time": ""}
                ]
            }
        elif workflow_status == "导师驳回":
            return {
                "status": "审核不通过",
                "node": "合作导师",
                "currentApproval": "合作导师审核（已驳回）",
                "steps": [
                    {"status": "已完成", "role": "学生申请", "time": postdoc.created_at.strftime("%Y-%m-%d %H:%M") if postdoc.created_at else ""},
                    {"status": "已拒绝", "role": "导师审核", "time": workflow.updated_at.strftime("%Y-%m-%d %H:%M") if workflow.updated_at else ""},
                    {"status": "等待中", "role": "学院审核", "time": ""}
                ]
            }
        elif workflow_status == "学院未审核":
            return {
                "status": "审核通过",
                "node": "学院管理员",
                "currentApproval": "学院管理员审核（待处理）",
                "steps": [
                    {"status": "已完成", "role": "学生申请", "time": postdoc.created_at.strftime("%Y-%m-%d %H:%M") if postdoc.created_at else ""},
                    {"status": "已完成", "role": "导师审核", "time": workflow.updated_at.strftime("%Y-%m-%d %H:%M") if workflow.updated_at else ""},
                    {"status": "进行中", "role": "学院审核", "time": ""}
                ]
            }
        elif workflow_status == "学院驳回":
            return {
                "status": "审核不通过",
                "node": "学院管理员",
                "currentApproval": "学院管理员审核（已驳回）",
                "steps": [
                    {"status": "已完成", "role": "学生申请", "time": postdoc.created_at.strftime("%Y-%m-%d %H:%M") if postdoc.created_at else ""},
                    {"status": "已完成", "role": "导师审核", "time": ""},
                    {"status": "已拒绝", "role": "学院审核", "time": workflow.updated_at.strftime("%Y-%m-%d %H:%M") if workflow.updated_at else ""}
                ]
            }
        elif workflow_status == "已审核":
            return {
                "status": "审核通过",
                "node": "学院管理员",
                "currentApproval": "审核结束（已通过）",
                "steps": [
                    {"status": "已完成", "role": "学生申请", "time": postdoc.created_at.strftime("%Y-%m-%d %H:%M") if postdoc.created_at else ""},
                    {"status": "已完成", "role": "导师审核", "time": ""},
                    {"status": "已完成", "role": "学院审核", "time": workflow.updated_at.strftime("%Y-%m-%d %H:%M") if workflow.updated_at else ""}
                ]
            }
        else:
            return {
                "status": "审核中",
                "node": "合作导师",
                "currentApproval": "合作导师审核（待处理）",
                "steps": [
                    {"status": "已完成", "role": "学生申请", "time": postdoc.created_at.strftime("%Y-%m-%d %H:%M") if postdoc.created_at else ""},
                    {"status": "进行中", "role": "导师审核", "time": ""},
                    {"status": "等待中", "role": "学院审核", "time": ""}
                ]
            }
    else:
        # 没有workflow记录，显示默认状态
        return {
            "status": "未提交",
            "node": "学生",
            "currentApproval": "学生未提交申请",
            "steps": [
                {"status": "未开始", "role": "学生申请", "time": ""},
                {"status": "等待中", "role": "导师审核", "time": ""},
                {"status": "等待中", "role": "学院审核", "time": ""}
            ]
        }

def build_student_response(postdoc: EnterWorkstation, user_profile: Info, workflow: PostdocWorkflow, business_type: str = "进站申请", assessment_data: EnterAssessment = None, db: Session = None) -> Dict[str, Any]:
    """构建学生响应数据"""
    # 定义支持的业务类型映射
    business_type_mapping = {
        "进站申请": "entry_application",
        "进站考核": "entry_assessment", 
        "中期考核": "midterm_assessment",
        "年度考核": "annual_assessment",
        "延期考核": "extension_assessment",
        "出站考核": "leave_assessment"
    }
    
    # 获取对应的workflow字段
    workflow_field = business_type_mapping.get(business_type, "entry_application")
    workflow_status = getattr(workflow, workflow_field) if workflow else "未提交"
    
    if business_type == "进站申请":
        status_info = get_workflow_status_info(workflow, postdoc)
        
        return {
            "id": postdoc.id,
            "studentId": postdoc.user_id,  # 从bs_enter_workstation表获取user_id
            "name": user_profile.name if user_profile else "",  # 从bs_user_profile表获取name
            "applyTime": postdoc.created_at.strftime("%Y-%m-%d") if postdoc.created_at else "",  # 从bs_enter_workstation表获取created_at
            "user_id": postdoc.user_id,  # 从bs_enter_workstation表获取user_id
            "cotutor": postdoc.cotutor,  # 从bs_enter_workstation表获取cotutor
            "allitutor": postdoc.allitutor,  # 从bs_enter_workstation表获取allitutor
            "workflow_status": workflow_status,
            "business_type": business_type,
            **status_info  # 展开状态信息
        }
    else:  # 其他业务类型（进站考核、中期考核、年度考核等）
        # 获取对应业务类型的状态
        assessment_status = workflow_status
        
        # 构建业务类型的状态信息
        if assessment_status == "未提交":
            status_info = {
                "status": "未提交",
                "node": "学生",
                "currentApproval": f"学生未提交{business_type}",
                "steps": [
                    {"status": "未开始", "role": "学生申请", "time": ""},
                    {"status": "等待中", "role": "导师审核", "time": ""},
                    {"status": "等待中", "role": "学院审核", "time": ""}
                ]
            }
        elif assessment_status == "导师未审核":
            status_info = {
                "status": "审核中",
                "node": "合作导师",
                "currentApproval": "合作导师审核（待处理）",
                "steps": [
                    {"status": "已完成", "role": "学生申请", "time": ""},
                    {"status": "进行中", "role": "导师审核", "time": ""},
                    {"status": "等待中", "role": "学院审核", "time": ""}
                ]
            }
        elif assessment_status == "导师驳回":
            status_info = {
                "status": "审核不通过",
                "node": "合作导师",
                "currentApproval": "合作导师审核（已驳回）",
                "steps": [
                    {"status": "已完成", "role": "学生申请", "time": ""},
                    {"status": "已拒绝", "role": "导师审核", "time": ""},
                    {"status": "等待中", "role": "学院审核", "time": ""}
                ]
            }
        elif assessment_status == "学院未审核":
            status_info = {
                "status": "审核通过",
                "node": "学院管理员",
                "currentApproval": "学院管理员审核（待处理）",
                "steps": [
                    {"status": "已完成", "role": "学生申请", "time": ""},
                    {"status": "已完成", "role": "导师审核", "time": ""},
                    {"status": "进行中", "role": "学院审核", "time": ""}
                ]
            }
        elif assessment_status == "学院驳回":
            status_info = {
                "status": "审核不通过",
                "node": "学院管理员",
                "currentApproval": "学院管理员审核（已驳回）",
                "steps": [
                    {"status": "已完成", "role": "学生申请", "time": ""},
                    {"status": "已完成", "role": "导师审核", "time": ""},
                    {"status": "已拒绝", "role": "学院审核", "time": ""}
                ]
            }
        elif assessment_status == "已审核":
            status_info = {
                "status": "审核通过",
                "node": "学院管理员",
                "currentApproval": "审核结束（已通过）",
                "steps": [
                    {"status": "已完成", "role": "学生申请", "time": ""},
                    {"status": "已完成", "role": "导师审核", "time": ""},
                    {"status": "已完成", "role": "学院审核", "time": ""}
                ]
            }
        else:
            status_info = {
                "status": "审核中",
                "node": "合作导师",
                "currentApproval": "合作导师审核（待处理）",
                "steps": [
                    {"status": "已完成", "role": "学生申请", "time": ""},
                    {"status": "进行中", "role": "导师审核", "time": ""},
                    {"status": "等待中", "role": "学院审核", "time": ""}
                ]
            }
        
        # 获取进站考核的提交时间
        assessment_time = ""
        if assessment_data and assessment_data.created_at:
            assessment_time = assessment_data.created_at.strftime("%Y-%m-%d")
        elif postdoc.created_at:
            assessment_time = postdoc.created_at.strftime("%Y-%m-%d")
        
        # 获取科研成果数据
        achievement_data = get_student_achievement_data(postdoc.user_id, db)
        
        # 获取教育经历和工作经历数据
        education_work_data = {}
        if user_profile:
            education_work_data = get_student_education_work_data(user_profile.id, db)
        
        return {
            "id": postdoc.id,
            "studentId": postdoc.user_id,
            "name": user_profile.name if user_profile else "",
            "applyTime": assessment_time,
            "user_id": postdoc.user_id,
            "cotutor": postdoc.cotutor,
            "allitutor": postdoc.allitutor,
            "workflow_status": assessment_status,
            "business_type": business_type,
            "user_info": {
                "name": user_profile.name if user_profile else "",
                "gender": user_profile.gender if user_profile else "",
                "birth_year": user_profile.birth_year if user_profile else "",
                "nationality": user_profile.nationality if user_profile else "",
                "political_status": user_profile.political_status if user_profile else "",
                "phone": user_profile.phone if user_profile else "",
                "religion": user_profile.religion if user_profile else "",
                "id_number": user_profile.id_number if user_profile else "",
                "is_religious_staff": user_profile.is_religious_staff if user_profile else "",
                "research_direction": user_profile.research_direction if user_profile else "",
                "other": user_profile.other if user_profile else "",
                "education_experience": education_work_data.get("education_experience", []),
                "work_experience": education_work_data.get("work_experience", [])
            } if user_profile else None,  # 添加用户详细信息
            "achievement_data": achievement_data,  # 添加科研成果数据
            **status_info
        }

@router.get(
    "/students", 
    response_model=List[dict],
    summary="获取学生进站申请和进站考核列表",
    description="导师获取所有申请自己的学生进站申请信息，以及有师生关系的学生进站考核信息，包含学生基本信息、申请状态和流程进度"
)
def get_teacher_students(
    business_type: str = Query(None, description="业务类型过滤"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    导师获取学生信息列表
    
    获取所有申请该导师的学生进站申请信息，以及有师生关系的学生进站考核信息，包括：
    - 学生基本信息（姓名、学号等）
    - 业务类型（进站申请/进站考核）
    - 申请状态（未提交、审核中、审核通过、审核不通过）
    - 流程步骤和当前节点
    - 申请时间和审核时间
    """
    print(f"当前用户: {current_user.username}, 角色: {current_user.role}")  # 调试信息
    
    # 验证用户是否为导师
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="只有导师可以访问此接口")
    
    # 获取导师的姓名（从users表的username字段获取）
    teacher_name = current_user.username
    
    result = []
    
    # 定义支持的业务类型映射
    business_type_mapping = {
        "进站申请": "entry_application",
        "进站考核": "entry_assessment", 
        "中期考核": "midterm_assessment",
        "年度考核": "annual_assessment",
        "延期考核": "extension_assessment",
        "出站考核": "leave_assessment"
    }
    
    # 如果指定了业务类型，验证是否支持
    if business_type and business_type not in business_type_mapping:
        raise HTTPException(status_code=400, detail=f"不支持的业务类型: {business_type}")
    
    # 1. 获取申请该导师的博士后信息（进站申请）
    if not business_type or business_type == "进站申请":
        # 匹配逻辑：博士后填写的cotutor字段与导师的username字段匹配
        postdocs = db.query(EnterWorkstation).join(Info, EnterWorkstation.user_id == Info.user_id).filter(
            EnterWorkstation.cotutor == teacher_name
        ).all()
        print(f"找到 {len(postdocs)} 个申请该导师的博士后记录")  # 调试信息
        
        for postdoc in postdocs:
            student_id = postdoc.user_id
            
            # 获取用户详细信息
            user_profile = db.query(Info).filter(Info.user_id == student_id).first()
            
            # 获取workflow状态
            workflow = db.query(PostdocWorkflow).filter(PostdocWorkflow.student_id == student_id).first()
            
            # 检查进站申请状态：不是未提交就说明有进站申请数据
            if workflow and workflow.entry_application and workflow.entry_application != "未提交":
                # 构建进站申请响应数据
                result.append(build_student_response(postdoc, user_profile, workflow, "进站申请", None, db))
                print(f"添加进站申请记录: 学生ID {student_id}, 状态: {workflow.entry_application}")
            else:
                print(f"跳过学生 {student_id}: 进站申请状态为未提交或无workflow记录")
    
    # 2. 获取与该导师有师生关系的学生（其他考核类型）
    if not business_type or business_type in ["进站考核", "中期考核", "年度考核", "延期考核", "出站考核"]:
        # 通过SupervisorStudent表查找师生关系
        supervisor_students = db.query(SupervisorStudent).filter(
            SupervisorStudent.supervisor_id == current_user.id
        ).all()
        print(f"找到 {len(supervisor_students)} 个师生关系记录")  # 调试信息
        
        for supervisor_student in supervisor_students:
            student_id = supervisor_student.student_id
            
            # 获取学生的进站申请信息（用于获取基本信息）
            postdoc = db.query(EnterWorkstation).filter(EnterWorkstation.user_id == student_id).first()
            if not postdoc:
                print(f"跳过学生 {student_id}: 没有进站申请记录")
                continue
            
            # 获取用户详细信息
            user_profile = db.query(Info).filter(Info.user_id == student_id).first()
            
            # 获取workflow状态
            workflow = db.query(PostdocWorkflow).filter(PostdocWorkflow.student_id == student_id).first()
            
            # 根据业务类型检查相应的状态
            if business_type:
                # 如果指定了业务类型，只检查该类型的状态
                workflow_field = business_type_mapping[business_type]
                if workflow and getattr(workflow, workflow_field) and getattr(workflow, workflow_field) != "未提交":
                    # 获取考核数据（如果有的话）
                    assessment_data = None
                    if business_type == "进站考核":
                        assessment_data = db.query(EnterAssessment).filter(EnterAssessment.user_id == student_id).first()
                    
                    # 构建响应数据
                    result.append(build_student_response(postdoc, user_profile, workflow, business_type, assessment_data, db))
                    print(f"添加{business_type}记录: 学生ID {student_id}, 状态: {getattr(workflow, workflow_field)}")
                else:
                    print(f"跳过学生 {student_id}: {business_type}状态为未提交或无workflow记录")
            else:
                # 如果没有指定业务类型，检查所有考核类型
                for bt, wf in business_type_mapping.items():
                    if bt != "进站申请" and workflow and getattr(workflow, wf) and getattr(workflow, wf) != "未提交":
                        # 获取考核数据（如果有的话）
                        assessment_data = None
                        if bt == "进站考核":
                            assessment_data = db.query(EnterAssessment).filter(EnterAssessment.user_id == student_id).first()
                        
                        # 构建响应数据
                        result.append(build_student_response(postdoc, user_profile, workflow, bt, assessment_data, db))
                        print(f"添加{bt}记录: 学生ID {student_id}, 状态: {getattr(workflow, wf)}")
    

    
    print(f"总共返回 {len(result)} 条记录")
    return result

@router.get(
    "/student/{user_id}", 
    response_model=dict,
    summary="通过id查看学生进站申请或进站考核的信息",
    description="导师获取指定学生的详细进站申请或进站考核信息，需要根据业务类型参数确定查看内容"
)
def get_student_detail(
    user_id: int,
    business_type: str = "进站申请",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    导师获取特定学生的详细信息
    
    获取指定学生的完整进站申请或进站考核信息，包括：
    - 学生基本信息
    - 申请详细信息
    - 当前审核状态
    - 流程步骤详情
    """
    # 验证用户是否为导师
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="只有导师可以访问此接口")
    
    # 根据user_id获取博士后信息
    postdoc = db.query(EnterWorkstation).filter(EnterWorkstation.user_id == user_id).first()
    if not postdoc:
        raise HTTPException(status_code=404, detail="博士后不存在")
    
    # 获取用户详细信息
    user_profile = db.query(Info).filter(Info.user_id == user_id).first()
    
    # 获取workflow状态
    workflow = db.query(PostdocWorkflow).filter(PostdocWorkflow.student_id == user_id).first()
    
    # 定义支持的业务类型映射
    business_type_mapping = {
        "进站申请": "entry_application",
        "进站考核": "entry_assessment", 
        "中期考核": "midterm_assessment",
        "年度考核": "annual_assessment",
        "延期考核": "extension_assessment",
        "出站考核": "leave_assessment"
    }
    
    # 验证业务类型是否支持
    if business_type not in business_type_mapping:
        raise HTTPException(status_code=400, detail=f"不支持的业务类型: {business_type}")
    
    # 根据业务类型进行不同的验证
    if business_type == "进站申请":
        # 验证博士后是否申请了该导师
        teacher_name = current_user.username
        
        if postdoc.cotutor != teacher_name:
            raise HTTPException(status_code=403, detail="该博士后没有申请您作为导师")
    else:
        # 对于其他业务类型（进站考核、中期考核、年度考核等），验证是否有师生关系
        existing_relationship = db.query(SupervisorStudent).filter(
            SupervisorStudent.supervisor_id == current_user.id,
            SupervisorStudent.student_id == user_id
        ).first()
        
        if not existing_relationship:
            raise HTTPException(status_code=403, detail="该学生与您没有师生关系，无法查看相关信息")
    
    # 根据workflow状态确定显示状态
    return build_student_response(postdoc, user_profile, workflow, business_type, None, db)

class ApproveRequest(BaseModel):
    approved: bool
    comment: str = ""
    business_type: str = "进站申请"  # 业务类型：进站申请 或 进站考核

@router.put(
    "/student/{user_id}/approve",
    summary="审核学生进站申请或进站考核",
    description="导师审核学生的进站申请或进站考核，可以选择通过或驳回，并添加审核意见"
)
def approve_student(
    user_id: int,
    request: ApproveRequest = Body(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    导师审核学生申请
    
    审核指定学生的进站申请或进站考核：
    - 通过：申请进入学院审核阶段
    - 驳回：申请被拒绝，学生需要重新提交
    - 可以添加审核意见说明
    """
    print(f"审核请求 - 用户: {current_user.username}, 用户ID: {user_id}, 业务类型: {request.business_type}, 审核结果: {request.approved}")  # 调试信息
    
    # 验证用户是否为导师
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="只有导师可以访问此接口")
    
    # 根据user_id获取博士后信息
    postdoc = db.query(EnterWorkstation).filter(EnterWorkstation.user_id == user_id).first()
    if not postdoc:
        raise HTTPException(status_code=404, detail="博士后不存在")
    
    # 获取用户详细信息
    user_profile = db.query(Info).filter(Info.user_id == user_id).first()
    
    # 获取或创建工作流程记录
    workflow = db.query(PostdocWorkflow).filter(PostdocWorkflow.student_id == user_id).first()
    if not workflow:
        workflow = PostdocWorkflow(student_id=user_id)
        db.add(workflow)
        db.commit()
        db.refresh(workflow)
    
    # 定义支持的业务类型映射
    business_type_mapping = {
        "进站申请": "entry_application",
        "进站考核": "entry_assessment", 
        "中期考核": "midterm_assessment",
        "年度考核": "annual_assessment",
        "延期考核": "extension_assessment",
        "出站考核": "leave_assessment"
    }
    
    # 验证业务类型是否支持
    if request.business_type not in business_type_mapping:
        raise HTTPException(status_code=400, detail=f"不支持的业务类型: {request.business_type}")
    
    # 获取对应的workflow字段
    workflow_field = business_type_mapping[request.business_type]
    
    # 根据业务类型进行不同的验证和处理
    if request.business_type == "进站申请":
        # 验证博士后是否申请了该导师
        teacher_name = current_user.username
        
        if postdoc.cotutor != teacher_name:
            raise HTTPException(status_code=403, detail="该博士后没有申请您作为导师")
        
        # 根据审核结果更新workflow状态
        if request.approved:
            # 导师通过，更新为学院未审核状态
            setattr(workflow, workflow_field, "学院未审核")
            status_message = "进站申请审核通过，已提交学院审核"
            
            # 创建师生关系记录到SupervisorStudent表
            existing_relationship = db.query(SupervisorStudent).filter(
                SupervisorStudent.supervisor_id == current_user.id,
                SupervisorStudent.student_id == user_id
            ).first()
            
            if not existing_relationship:
                supervisor_student = SupervisorStudent(
                    supervisor_id=current_user.id,
                    student_id=user_id
                )
                db.add(supervisor_student)
                print(f"创建师生关系: 导师ID {current_user.id}, 学生ID {user_id}")
        else:
            # 导师驳回
            setattr(workflow, workflow_field, "导师驳回")
            status_message = "进站申请审核驳回"
            
            # 如果驳回，删除师生关系记录（如果存在）
            existing_relationship = db.query(SupervisorStudent).filter(
                SupervisorStudent.supervisor_id == current_user.id,
                SupervisorStudent.student_id == user_id
            ).first()
            
            if existing_relationship:
                db.delete(existing_relationship)
                print(f"删除师生关系: 导师ID {current_user.id}, 学生ID {user_id}")
        
        workflow_status = getattr(workflow, workflow_field)
        
    else:
        # 对于其他业务类型（进站考核、中期考核、年度考核等），验证是否有师生关系
        existing_relationship = db.query(SupervisorStudent).filter(
            SupervisorStudent.supervisor_id == current_user.id,
            SupervisorStudent.student_id == user_id
        ).first()
        
        if not existing_relationship:
            raise HTTPException(status_code=403, detail="该学生与您没有师生关系，无法审核")
        
        # 根据审核结果更新workflow状态
        if request.approved:
            # 导师通过，更新为学院未审核状态
            setattr(workflow, workflow_field, "学院未审核")
            status_message = f"{request.business_type}审核通过，已提交学院审核"
        else:
            # 导师驳回
            setattr(workflow, workflow_field, "导师驳回")
            status_message = f"{request.business_type}审核驳回"
        
        workflow_status = getattr(workflow, workflow_field)
    
    workflow.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(workflow)
    
    return {
        "message": status_message,
        "approved": request.approved,
        "business_type": request.business_type,
        "user_id": user_id,
        "student_name": user_profile.name if user_profile else "",
        "workflow_status": workflow_status,
        "updated_at": workflow.updated_at
    } 