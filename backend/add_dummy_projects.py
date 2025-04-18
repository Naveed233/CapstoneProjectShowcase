# backend/add_dummy_projects.py

from database import SessionLocal
from models import Team, Project

db = SessionLocal()

# Delete old data
db.query(Project).delete()
db.query(Team).delete()

# Create teams
team1 = Team(name="Team Alpha", description="Team in Building 1", logo_url=None)
team2 = Team(name="Team Beta", description="Team in Building 2", logo_url=None)

db.add_all([team1, team2])
db.commit()
db.refresh(team1)
db.refresh(team2)

# Add projects linked to those teams, with building labels
project1 = Project(
    title="Smart Recycling Bin",
    description="Uses AI to sort waste automatically.",
    image_url="https://techcrunch.com/wp-content/uploads/2022/08/R1_TrashBot.jpg",
    video_url="https://youtu.be/LJYWRTRJThY?feature=shared",
    github_url="https://github.com/team1/smart-bin",
    live_demo_url="https://demo.smartbin.com",
    members="Alex, Lewis, Magdi, Naveed",
    team_id=team1.id,
    building="Building 1"  # ✅ Add this
)

project2 = Project(
    title="Drone Delivery System",
    description="Delivers snacks across campus with drones.",
    image_url="https://dam.mediacorp.sg/image/upload/s--o6Tb-5aM--/f_auto,q_auto/c_fill,g_auto,h_622,w_830/v1/tdy-migration/25094867.jpg?itok=lXVFo07k",
    video_url="https://youtu.be/Hhp11I-vGHA?feature=shared",
    github_url="https://github.com/team2/delivery-drone",
    live_demo_url="https://drone.demo.com",
    members="Michael, Xan, Yuma, Justin",
    team_id=team2.id,
    building="Building 2"  # ✅ Add this
)

db.add_all([project1, project2])
db.commit()
print("✅ Dummy teams and projects added")
db.close()
