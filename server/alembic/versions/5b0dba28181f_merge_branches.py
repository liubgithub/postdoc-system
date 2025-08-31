"""merge branches

Revision ID: 5b0dba28181f
Revises: 8f1ed45b9f41, change_time_to_date
Create Date: 2025-08-28 10:52:51.739618

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5b0dba28181f'
down_revision: Union[str, None] = ('8f1ed45b9f41', 'change_time_to_date')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
