from app.database import Base, engine
from app import models

print("Creating accounting_entries table...")
Base.metadata.create_all(bind=engine, tables=[models.AccountingEntry.__table__])
