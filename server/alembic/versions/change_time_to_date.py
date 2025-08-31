"""change_approval_time_to_date_type

Revision ID: change_approval_time_to_date_type
Revises: a647769a3a18
Create Date: 2025-01-27 10:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
from datetime import datetime

# revision identifiers, used by Alembic.
revision: str = 'change_time_to_date'
down_revision: Union[str, None] = 'a647769a3a18'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # 获取数据库连接
    connection = op.get_bind()
    
    # 1. 先将字段改为可空
    op.alter_column('bs_enter_assessment', 'approval_time', nullable=True)
    
    # 2. 使用 PostgreSQL 的 USING 子句直接转换类型
    # 这将自动处理字符串到日期的转换
    connection.execute(sa.text("""
        ALTER TABLE bs_enter_assessment 
        ALTER COLUMN approval_time TYPE DATE 
        USING CASE 
            WHEN approval_time IS NULL THEN NULL
            WHEN approval_time = '' THEN NULL
            ELSE approval_time::DATE 
        END
    """))
    
    # 3. 检查是否还有空值
    result = connection.execute(sa.text("SELECT COUNT(*) FROM bs_enter_assessment WHERE approval_time IS NULL"))
    null_count = result.scalar()
    
    if null_count == 0:
        op.alter_column('bs_enter_assessment', 'approval_time', nullable=False)
    else:
        print(f"Warning: {null_count} records still have NULL approval_time values")


def downgrade() -> None:
    """Downgrade schema."""
    # 获取数据库连接
    connection = op.get_bind()
    
    # 1. 先将字段改为可空
    op.alter_column('bs_enter_assessment', 'approval_time', nullable=True)
    
    # 2. 使用 PostgreSQL 的 USING 子句将日期转换回字符串
    connection.execute(sa.text("""
        ALTER TABLE bs_enter_assessment 
        ALTER COLUMN approval_time TYPE VARCHAR(255) 
        USING CASE 
            WHEN approval_time IS NULL THEN NULL
            ELSE approval_time::TEXT 
        END
    """))
    
    # 3. 最后将字段设为非空
    op.alter_column('bs_enter_assessment', 'approval_time', nullable=False)
