from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime
from enum import Enum
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

# ===== CLIENT SYSTEM MODELS =====

# User Role Enums
class UserRole(str, Enum):
    ADMIN = "admin"
    MODERATOR = "moderator" 
    CLIENT_PREMIUM = "client_premium"
    CLIENT_STANDARD = "client_standard"
    PROSPECT = "prospect"

# Loyalty Tiers
class LoyaltyTier(str, Enum):
    BRONZE = "bronze"
    SILVER = "silver" 
    GOLD = "gold"
    PLATINUM = "platinum"

# Client Profile Models
class ClientProfile(BaseModel):
    # Personal Information
    first_name: str
    last_name: str
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    postal_code: Optional[str] = None
    country: str = "France"
    
    # Company Information (optional)
    company_name: Optional[str] = None
    company_industry: Optional[str] = None
    company_size: Optional[str] = None
    job_title: Optional[str] = None
    
    # Preferences
    preferred_language: str = "fr"
    newsletter_subscribed: bool = False
    sms_notifications: bool = False
    email_notifications: bool = True

class ClientProfileCreate(BaseModel):
    first_name: str
    last_name: str
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    postal_code: Optional[str] = None
    country: str = "France"
    company_name: Optional[str] = None
    company_industry: Optional[str] = None
    company_size: Optional[str] = None
    job_title: Optional[str] = None
    preferred_language: str = "fr"
    newsletter_subscribed: bool = False
    sms_notifications: bool = False
    email_notifications: bool = True

class ClientProfileUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    postal_code: Optional[str] = None
    country: Optional[str] = None
    company_name: Optional[str] = None
    company_industry: Optional[str] = None
    company_size: Optional[str] = None
    job_title: Optional[str] = None
    preferred_language: Optional[str] = None
    newsletter_subscribed: Optional[bool] = None
    sms_notifications: Optional[bool] = None
    email_notifications: Optional[bool] = None

# Loyalty Points System
class PointTransaction(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    points: int  # Can be positive (earned) or negative (spent)
    transaction_type: str  # "earned", "spent", "adjustment", "bonus"
    description: str
    reference_id: Optional[str] = None  # Reference to service, order, etc.
    created_by: Optional[str] = None  # Admin/technician who added points
    created_at: datetime = Field(default_factory=datetime.utcnow)

class PointTransactionCreate(BaseModel):
    user_id: str
    points: int
    transaction_type: str
    description: str
    reference_id: Optional[str] = None

# User Extended Model
class UserExtended(BaseModel):
    id: str
    username: str
    email: str
    full_name: str
    role: UserRole
    is_active: bool
    created_at: datetime
    
    # Loyalty System
    total_points: int = 0
    available_points: int = 0
    loyalty_tier: LoyaltyTier = LoyaltyTier.BRONZE
    
    # Client Profile
    profile: Optional[ClientProfile] = None
    
    # Statistics
    total_orders: int = 0
    total_spent: float = 0.0
    last_activity: Optional[datetime] = None

# Service/Quote System
class ServiceCategory(str, Enum):
    WEB_DEVELOPMENT = "Développement Web"
    MOBILE_APP = "Application Mobile"
    AI_ML = "Intelligence Artificielle"
    CYBERSECURITY = "Cybersécurité" 
    CONSULTING = "Conseil IT"
    MAINTENANCE = "Maintenance"
    FORMATION = "Formation"

class QuoteRequest(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    service_category: ServiceCategory
    title: str
    description: str
    budget_range: Optional[str] = None
    deadline: Optional[datetime] = None
    priority: str = "normal"  # low, normal, high, urgent
    status: str = "pending"  # pending, in_review, approved, rejected, completed
    files: Optional[List[str]] = []  # File URLs
    
    # Response from team
    estimated_price: Optional[float] = None
    estimated_duration: Optional[str] = None
    admin_notes: Optional[str] = None
    assigned_to: Optional[str] = None
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class QuoteRequestCreate(BaseModel):
    service_category: ServiceCategory
    title: str
    description: str
    budget_range: Optional[str] = None
    deadline: Optional[datetime] = None
    priority: str = "normal"

class QuoteRequestUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    budget_range: Optional[str] = None
    deadline: Optional[datetime] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    estimated_price: Optional[float] = None
    estimated_duration: Optional[str] = None
    admin_notes: Optional[str] = None
    assigned_to: Optional[str] = None

# Support Ticket System
class SupportTicket(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    title: str
    description: str
    category: str  # technical, billing, general, feature_request
    priority: str = "normal"  # low, normal, high, urgent
    status: str = "open"  # open, in_progress, waiting_response, resolved, closed
    
    # Messages in the ticket
    messages: List[dict] = []  # [{user_id, message, timestamp, is_admin}]
    
    assigned_to: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    resolved_at: Optional[datetime] = None

class SupportTicketCreate(BaseModel):
    title: str
    description: str
    category: str
    priority: str = "normal"

class TicketMessage(BaseModel):
    ticket_id: str
    message: str

# Dashboard Statistics
class ClientDashboardStats(BaseModel):
    total_points: int
    available_points: int
    loyalty_tier: LoyaltyTier
    next_tier_points: int
    active_quotes: int
    completed_projects: int
    open_tickets: int
    recent_transactions: List[PointTransaction]

class AdminClientStats(BaseModel):
    total_clients: int
    new_clients_this_month: int
    active_clients: int
    total_points_distributed: int
    pending_quotes: int
    open_tickets: int
    revenue_this_month: float
    top_clients: List[dict]