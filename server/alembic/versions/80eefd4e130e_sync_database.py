"""Sync database state

Revision ID: 80eefd4e130e
Revises: f4ea305d3bfc
Create Date: 2025-01-27 10:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '80eefd4e130e'
down_revision: Union[str, None] = 'f4ea305d3bfc'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # This migration is a placeholder to sync the database state
    # The actual tables were created manually or by another process
    pass


def downgrade() -> None:
    """Downgrade schema."""
    # This migration is a placeholder to sync the database state
    pass 