# backend/add_teams.py
from database import SessionLocal
from models import Team

# Create DB session
db = SessionLocal()

# Create teams
team1 = Team(name="Team A", description="Awesome team A")
team2 = Team(name="Team B", description="Brilliant team B")

# Add to DB
db.add_all([team1, team2])
db.commit()
print("✅ Teams added")

db.close()
