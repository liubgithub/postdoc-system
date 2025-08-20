"""merge branches

Revision ID: 8f1ed45b9f41
Revises: a647769a3a18, aabbccddeeff
Create Date: 2025-08-20 09:50:54.353990

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '8f1ed45b9f41'
down_revision: Union[str, None] = ('a647769a3a18', 'aabbccddeeff')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
