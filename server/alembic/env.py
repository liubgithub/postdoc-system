from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context
import os
import sys

# 添加项目根目录到 Python 路径
current_path = os.path.dirname(os.path.abspath(__file__))
project_path = os.path.dirname(current_path)
sys.path.insert(0, project_path)

# 导入你的模型和配置
from app.config import settings
from app.database import Base

# 导入所有模型（重要：确保所有表都被注册）
from app.models.user import User

# 导入userinfoRegister相关的所有模型
from app.userinfoRegister.pre_entry_paper.models import PreEntryPaper
from app.userinfoRegister.pre_entry_patent.models import PreEntryPatent
from app.userinfoRegister.pre_entry_book.models import PreEntryBook
from app.userinfoRegister.pre_entry_competition_award.models import PreEntryCompetitionAward
from app.userinfoRegister.pre_entry_conference.models import PreEntryConference
from app.userinfoRegister.pre_entry_new_variety.models import PreEntryNewVariety
from app.userinfoRegister.pre_entry_project.models import PreEntryProject
from app.userinfoRegister.pre_entry_subject_research.models import PreEntrySubjectResearch
from app.userinfoRegister.pre_entry_industry_standard.models import PreEntryIndustryStandard
from app.userinfoRegister.bs_user_profile.models import Info, EducationExperience, WorkExperience

# 导入enterWorkstation相关的所有模型
from app.enterWorkstation.enterapply.models import EnterWorkstation
from app.enterWorkstation.enterAssessment.models import EnterAssessment

# 如果有其他模型，在这里导入
# from app.models.post import Post

# Alembic 配置对象
config = context.config


# 🔧 修复：正确设置数据库 URL，避免插值语法错误
# 方法1：直接在配置段中设置，避免插值问题
def get_url():
    return settings.DATABASE_URL


# 配置日志
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# 设置目标元数据（这是关键！）
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """
    离线模式运行迁移

    这种模式下不需要创建数据库连接，
    而是将迁移命令输出为 SQL 脚本。
    """
    # 🔧 修复：直接使用 URL，不通过 config
    url = get_url()
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        # 比较服务器默认值
        compare_server_default=True,
        # 比较类型
        compare_type=True,
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """
    在线模式运行迁移

    这种模式下会创建真实的数据库连接并执行迁移。
    """
    # 🔧 修复：手动构建配置，避免插值问题
    configuration = config.get_section(config.config_ini_section, {})

    # 手动设置数据库 URL
    configuration['sqlalchemy.url'] = get_url()

    # 创建数据库连接
    connectable = engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            # 比较服务器默认值
            compare_server_default=True,
            # 比较类型
            compare_type=True,
            # 渲染项配置
            render_as_batch=True,  # 对 SQLite 友好
        )

        with context.begin_transaction():
            context.run_migrations()


# 根据运行模式选择迁移方式
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()