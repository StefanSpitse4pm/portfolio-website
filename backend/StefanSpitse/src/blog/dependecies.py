from fastapi import Form
from datetime import datetime
from blog.schemas import Article

def parse_article(
    title: str = Form(...),
    slug: str = Form(..., pattern=r'^\S+$'),
    cover_image: str = Form(...),
    status: str = Form(...),
    created_at: datetime = Form(...),
    published_at: datetime = Form(...),
) -> Article:
    return Article(
        title=title,
        slug=slug,
        cover_image=cover_image,
        status=status,
        created_at=created_at,
        published_at=published_at,
    )
