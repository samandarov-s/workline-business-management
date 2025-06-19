from app.database import Base, engine
from app import models  # IMPORTANT: this must import models.task

Base.metadata.create_all(bind=engine)

print("Tables created.")
