"""add student_id foreign key to assessment_applications

Revision ID: e73e008a8ed7
Revises: 59994aa2a6eb
Create Date: 2025-07-27 16:00:31.887566

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e73e008a8ed7'
down_revision: Union[str, None] = '59994aa2a6eb'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
