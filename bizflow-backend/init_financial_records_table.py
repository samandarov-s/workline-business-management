from app.database import Base, engine
from app import models

print("Creating financial_records table...")
Base.metadata.create_all(bind=engine, tables=[models.FinancialRecord.__table__])
print("Done.")
