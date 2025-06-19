from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app import models, schemas, database
from app.auth_utils import get_current_user

router = APIRouter(
    prefix="/inventory/transactions",
    tags=["Inventory Transactions"]
)

@router.post("/", response_model=schemas.InventoryTransactionOut, status_code=status.HTTP_201_CREATED)
def create_transaction(
    tx: schemas.InventoryTransactionCreate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)
):
    item = db.query(models.InventoryItem).filter(models.InventoryItem.id == tx.item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    # ✅ Prevent negative inventory
    if item.quantity + tx.quantity_change < 0:
        raise HTTPException(status_code=400, detail="Insufficient stock for this transaction")

    # ✅ Apply inventory update
    item.quantity += tx.quantity_change

    transaction = models.InventoryTransaction(
        item_id=tx.item_id,
        quantity_change=tx.quantity_change,
        type=tx.type,
        note=tx.note,
        performed_by=current_user.id
    )

    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    return transaction

@router.get("/", response_model=List[schemas.InventoryTransactionOut])
def get_all_transactions(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)
):
    return db.query(models.InventoryTransaction).all()

@router.get("/{item_id}", response_model=List[schemas.InventoryTransactionOut])
def get_transactions_for_item(
    item_id: int,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)
):
    return db.query(models.InventoryTransaction).filter(models.InventoryTransaction.item_id == item_id).all()
