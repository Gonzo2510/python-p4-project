"""empty message

Revision ID: d41fbf080679
Revises: 0038dc89b65a
Create Date: 2024-05-21 11:04:27.423589

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd41fbf080679'
down_revision = '0038dc89b65a'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('courses', schema=None) as batch_op:
        batch_op.add_column(sa.Column('department_id', sa.Integer(), nullable=True))
        batch_op.create_foreign_key(batch_op.f('fk_courses_department_id_departments'), 'departments', ['department_id'], ['id'])

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('courses', schema=None) as batch_op:
        batch_op.drop_constraint(batch_op.f('fk_courses_department_id_departments'), type_='foreignkey')
        batch_op.drop_column('department_id')

    # ### end Alembic commands ###
