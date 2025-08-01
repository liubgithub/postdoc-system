"""update competition award time field to datetime

Revision ID: update_competition_award_time
Revises: 59994aa2a6eb
Create Date: 2024-01-01 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = 'update_competition_award_time'
down_revision = '59994aa2a6eb'
branch_labels = None
depends_on = None


def upgrade():
    # 将竞赛获奖表的time字段从Integer改为DateTime
    op.alter_column('bs_pre_entry_competition_award', 'time',
                    existing_type=sa.Integer(),
                    type_=sa.DateTime(),
                    existing_nullable=True,
                    nullable=True)


def downgrade():
    # 回滚：将time字段从DateTime改回Integer
    op.alter_column('bs_pre_entry_competition_award', 'time',
                    existing_type=sa.DateTime(),
                    type_=sa.Integer(),
                    existing_nullable=True,
                    nullable=True) 