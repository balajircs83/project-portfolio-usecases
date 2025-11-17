from typing import List, Optional
from datetime import datetime

from sqlmodel import Field, Relationship, SQLModel

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    hashed_password: str
    is_active: bool = Field(default=True)

    documents: List["Document"] = Relationship(back_populates="owner")

class Category(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(unique=True, index=True)

    documents: List["Document"] = Relationship(back_populates="category")
    subcategories: List["Subcategory"] = Relationship(back_populates="parent_category")

class Subcategory(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    category_id: Optional[int] = Field(default=None, foreign_key="category.id")

    parent_category: Optional[Category] = Relationship(back_populates="subcategories")
    documents: List["Document"] = Relationship(back_populates="subcategory")

class Document(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    content: str
    document_type: str # e.g., "pdf", "md"
    summary: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    owner_id: Optional[int] = Field(default=None, foreign_key="user.id")
    owner: Optional[User] = Relationship(back_populates="documents")

    category_id: Optional[int] = Field(default=None, foreign_key="category.id")
    category: Optional[Category] = Relationship(back_populates="documents")

    subcategory_id: Optional[int] = Field(default=None, foreign_key="subcategory.id")
    subcategory: Optional[Subcategory] = Relationship(back_populates="documents")
