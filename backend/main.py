from typing import Annotated, List
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select
from database import engine, get_session
from models import User, Document, Category, Subcategory, SQLModel
from auth import get_password_hash, verify_password, create_access_token, get_current_user

def create_db_and_tables():
    SQLModel.metadata.create_all(engine, checkfirst=True)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    create_db_and_tables()
    yield
    # Shutdown
    pass

app = FastAPI(lifespan=lifespan)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:5173"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# User Authentication Endpoints
@app.post("/register")
def register_user(user: User, session: Session = Depends(get_session)):
    db_user = session.exec(select(User).where(User.email == user.email)).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.hashed_password)
    user.hashed_password = hashed_password
    session.add(user)
    session.commit()
    session.refresh(user)
    return {"message": "User registered successfully", "user_id": user.id}

@app.post("/token")
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    session: Session = Depends(get_session)
):
    user = session.exec(select(User).where(User.email == form_data.username)).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me")
async def read_users_me(current_user: Annotated[User, Depends(get_current_user)]):
    return {"email": current_user.email, "id": current_user.id}

# Category Endpoints
@app.post("/categories/", response_model=Category)
def create_category(category: Category, current_user: Annotated[User, Depends(get_current_user)], session: Session = Depends(get_session)):
    session.add(category)
    session.commit()
    session.refresh(category)
    return category

@app.get("/categories/")
def read_categories(current_user: Annotated[User, Depends(get_current_user)], session: Session = Depends(get_session)):
    categories = session.exec(select(Category)).all()
    result = []
    for category in categories:
        subcategories = session.exec(select(Subcategory).where(Subcategory.category_id == category.id)).all()
        category_dict = {
            "id": category.id,
            "name": category.name,
            "subcategories": [{"id": sub.id, "name": sub.name, "category_id": sub.category_id} for sub in subcategories]
        }
        result.append(category_dict)
    return result

@app.put("/categories/{category_id}", response_model=Category)
def update_category(category_id: int, category: Category, current_user: Annotated[User, Depends(get_current_user)], session: Session = Depends(get_session)):
    db_category = session.get(Category, category_id)
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    db_category.name = category.name
    session.add(db_category)
    session.commit()
    session.refresh(db_category)
    return db_category

@app.delete("/categories/{category_id}")
def delete_category(category_id: int, current_user: Annotated[User, Depends(get_current_user)], session: Session = Depends(get_session)):
    category = session.get(Category, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    session.delete(category)
    session.commit()
    return {"message": "Category deleted successfully"}

# Subcategory Endpoints
@app.post("/subcategories/", response_model=Subcategory)
def create_subcategory(subcategory: Subcategory, current_user: Annotated[User, Depends(get_current_user)], session: Session = Depends(get_session)):
    session.add(subcategory)
    session.commit()
    session.refresh(subcategory)
    return subcategory

@app.get("/subcategories/", response_model=List[Subcategory])
def read_subcategories(current_user: Annotated[User, Depends(get_current_user)], session: Session = Depends(get_session)):
    subcategories = session.exec(select(Subcategory)).all()
    return subcategories

@app.put("/subcategories/{subcategory_id}", response_model=Subcategory)
def update_subcategory(subcategory_id: int, subcategory: Subcategory, current_user: Annotated[User, Depends(get_current_user)], session: Session = Depends(get_session)):
    db_subcategory = session.get(Subcategory, subcategory_id)
    if not db_subcategory:
        raise HTTPException(status_code=404, detail="Subcategory not found")
    db_subcategory.name = subcategory.name
    db_subcategory.category_id = subcategory.category_id
    session.add(db_subcategory)
    session.commit()
    session.refresh(db_subcategory)
    return db_subcategory

@app.delete("/subcategories/{subcategory_id}")
def delete_subcategory(subcategory_id: int, current_user: Annotated[User, Depends(get_current_user)], session: Session = Depends(get_session)):
    subcategory = session.get(Subcategory, subcategory_id)
    if not subcategory:
        raise HTTPException(status_code=404, detail="Subcategory not found")
    session.delete(subcategory)
    session.commit()
    return {"message": "Subcategory deleted successfully"}


# Document Endpoints
@app.post("/documents/", response_model=Document)
def create_document(document: Document, current_user: Annotated[User, Depends(get_current_user)], session: Session = Depends(get_session)):
    document.owner_id = current_user.id
    session.add(document)
    session.commit()
    session.refresh(document)
    return document

@app.get("/documents/", response_model=List[Document])
def read_documents(current_user: Annotated[User, Depends(get_current_user)], session: Session = Depends(get_session)):
    documents = session.exec(select(Document).where(Document.owner_id == current_user.id)).all()
    return documents

@app.get("/documents/{document_id}", response_model=Document)
def read_document(document_id: int, current_user: Annotated[User, Depends(get_current_user)], session: Session = Depends(get_session)):
    document = session.get(Document, document_id)
    if not document or document.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Document not found")
    return document

@app.put("/documents/{document_id}", response_model=Document)
def update_document(document_id: int, document: Document, current_user: Annotated[User, Depends(get_current_user)], session: Session = Depends(get_session)):
    db_document = session.get(Document, document_id)
    if not db_document or db_document.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Document not found")
    
    db_document.title = document.title
    db_document.content = document.content
    db_document.document_type = document.document_type
    db_document.summary = document.summary
    db_document.category_id = document.category_id
    db_document.subcategory_id = document.subcategory_id

    session.add(db_document)
    session.commit()
    session.refresh(db_document)
    return db_document

@app.delete("/documents/{document_id}")
def delete_document(document_id: int, current_user: Annotated[User, Depends(get_current_user)], session: Session = Depends(get_session)):
    document = session.get(Document, document_id)
    if not document or document.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Document not found")
    session.delete(document)
    session.commit()
    return {"message": "Document deleted successfully"}

