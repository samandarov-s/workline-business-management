from app.database import Base, engine
from app.models.time_entry import TimeEntry

print("Creating time_entries table...")
Base.metadata.create_all(bind=engine, tables=[TimeEntry.__table__])
