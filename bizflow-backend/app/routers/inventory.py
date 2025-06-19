from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app import models, schemas, database
from app.auth_utils import get_current_user

router = APIRouter(
    prefix="/inventory",
    tags=["Inventory"]
)

@router.post("/", response_model=schemas.InventoryOut, status_code=status.HTTP_201_CREATED)
def create_item(item: schemas.InventoryCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    existing = db.query(models.InventoryItem).filter(models.InventoryItem.sku == item.sku).first()
    if existing:
        raise HTTPException(status_code=400, detail="Item with this SKU already exists")
    new_item = models.InventoryItem(**item.model_dump())
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@router.get("/", response_model=List[schemas.InventoryOut])
def list_items(db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    return db.query(models.InventoryItem).all()

@router.get("/low-stock", response_model=List[schemas.InventoryOut])
def low_stock_items(db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    return db.query(models.InventoryItem).filter(models.InventoryItem.quantity <= models.InventoryItem.low_stock_threshold).all()

@router.get("/{item_id}", response_model=schemas.InventoryOut)
def get_item(item_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    item = db.query(models.InventoryItem).filter(models.InventoryItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item

@router.put("/{item_id}", response_model=schemas.InventoryOut)
def update_item(item_id: int, updates: schemas.InventoryUpdate, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    item = db.query(models.InventoryItem).filter(models.InventoryItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    for key, value in updates.model_dump(exclude_unset=True).items():
        setattr(item, key, value)
    db.commit()
    db.refresh(item)
    return item

@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_item(item_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    item = db.query(models.InventoryItem).filter(models.InventoryItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(item)
    db.commit()
    return None
