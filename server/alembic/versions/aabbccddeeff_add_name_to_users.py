"""add name to users

Revision ID: aabbccddeeff
Revises: 80eefd4e130e
Create Date: 2025-08-19 10:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'aabbccddeeff'
down_revision: Union[str, None] = 'update_competition_award_time'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('users', sa.Column('name', sa.String(length=50), nullable=True))


def downgrade() -> None:
    op.drop_column('users', 'name')

