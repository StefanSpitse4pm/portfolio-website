"""init

Revision ID: fba62bc773b9
Revises: 
Create Date: 2026-05-29 19:51:53.582158

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision: str = 'fba62bc773b9'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    # Create tables
    op.create_table(
        'articles',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.VARCHAR(length=255), nullable=True),
        sa.Column('slug', sa.VARCHAR(length=255), nullable=True),
        sa.Column('file_name', sa.VARCHAR(length=512), nullable=True),
        sa.Column('file_path', sa.VARCHAR(length=512), nullable=True),
        sa.Column('cover_image', sa.VARCHAR(length=512), nullable=True),
        sa.Column('status', sa.VARCHAR(length=20), nullable=True, server_default=sa.text("'draft'")),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('published_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('slug'),
    )
    op.create_index(op.f('ix_articles_id'), 'articles', ['id'], unique=False)
    op.create_index(op.f('ix_articles_file_path'), 'articles', ['file_path'], unique=True)

    op.create_table(
        'categories',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('category_name', sa.VARCHAR(length=255), nullable=True),
        sa.Column('parent_id', sa.Integer(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['parent_id'], ['categories.id']),
    )
    op.create_index(op.f('ix_categories_id'), 'categories', ['id'], unique=False)

    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('username', sa.VARCHAR(length=255), nullable=True),
        sa.Column('hashed_password', sa.VARCHAR(length=512), nullable=True),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)
    op.create_index(op.f('ix_users_username'), 'users', ['username'], unique=True)

    op.create_table(
        'projects',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.VARCHAR(length=255), nullable=True),
        sa.Column('description', sa.String(length=255), nullable=True),
        sa.Column('url', sa.VARCHAR(length=255), nullable=True),
        sa.Column('date', sa.Date(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_projects_id'), 'projects', ['id'], unique=False)

    op.create_table(
        'files',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('file_path', sa.VARCHAR(length=512), nullable=True),
        sa.Column('file_name', sa.String(length=512), nullable=True),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_files_id'), 'files', ['id'], unique=False)
    op.create_index(op.f('ix_files_file_path'), 'files', ['file_path'], unique=True)

    op.create_table(
        'project_tags',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('tag', sa.VARCHAR(length=30), nullable=True),
        sa.Column('project_id', sa.Integer(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['project_id'], ['projects.id']),
    )
    op.create_index(op.f('ix_project_tags_id'), 'project_tags', ['id'], unique=False)

    op.create_table(
        'file_categories',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('category_id', sa.Integer(), nullable=True),
        sa.Column('file_id', sa.Integer(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['category_id'], ['categories.id']),
        sa.ForeignKeyConstraint(['file_id'], ['files.id']),
    )
    op.create_index(op.f('ix_file_categories_id'), 'file_categories', ['id'], unique=False)


def downgrade() -> None:
    op.drop_table('file_categories')
    op.drop_table('project_tags')
    op.drop_table('files')
    op.drop_table('projects')
    op.drop_table('users')
    op.drop_table('categories')
    op.drop_table('articles')


    # ### end Alembic commands ###
