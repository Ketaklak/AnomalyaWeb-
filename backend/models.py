from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime
import uuid

# Article Models
class ArticleBase(BaseModel):
    title: str
    category: str
    excerpt: str
    content: str
    image: str
    author: str
    readTime: str
    tags: List[str]
    isPinned: bool = False

class ArticleCreate(ArticleBase):
    pass

class ArticleUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    image: Optional[str] = None
    author: Optional[str] = None
    readTime: Optional[str] = None
    tags: Optional[List[str]] = None
    isPinned: Optional[bool] = None

class Article(ArticleBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    date: datetime = Field(default_factory=datetime.utcnow)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# Contact Models
class ContactCreate(BaseModel):
    nom: str
    email: EmailStr
    sujet: str
    service: str
    message: str

class Contact(ContactCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    status: str = "nouveau"
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Service Models
class ServiceBase(BaseModel):
    title: str
    icon: str
    description: str
    features: List[str]
    price: str

class ServiceCreate(ServiceBase):
    pass

class Service(ServiceBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Testimonial Models
class TestimonialBase(BaseModel):
    name: str
    role: str
    content: str
    rating: int
    avatar: str

class TestimonialCreate(TestimonialBase):
    pass

class Testimonial(TestimonialBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Competence Models
class CompetenceBase(BaseModel):
    name: str
    level: int
    category: str

class CompetenceCreate(CompetenceBase):
    pass

class Competence(CompetenceBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)

# FAQ Models
class FAQBase(BaseModel):
    question: str
    answer: str

class FAQCreate(FAQBase):
    pass

class FAQ(FAQBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Newsletter Models
class NewsletterSubscription(BaseModel):
    email: EmailStr
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    subscribed_at: datetime = Field(default_factory=datetime.utcnow)
    active: bool = True

# Response Models
class ArticleListResponse(BaseModel):
    articles: List[Article]
    total: int
    hasMore: bool

class ApiResponse(BaseModel):
    success: bool
    message: str
    data: Optional[dict] = None