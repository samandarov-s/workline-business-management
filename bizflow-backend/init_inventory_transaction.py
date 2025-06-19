from app.database import Base, engine
from app import models  # must include InventoryItem and InventoryTransaction

print("Creating inventory-related tables...")
Base.metadata.create_all(
    bind=engine,
    tables=[
        models.InventoryItem.__table__,
        models.InventoryTransaction.__table__
    ]
)
print("Done.")
