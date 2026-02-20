from browser import window, document, timer

THREE = window.THREE

# --- PHYSICS CONSTANTS ---
GRAVITY = -0.015
FRICTION = 0.95
JUMP_FORCE = 0.3
MOVE_SPEED = 0.05

# Player State
velocity = {"x": 0, "y": 0, "z": 0}
pos = {"x": 0, "y": 1, "z": 0}
is_grounded = True

keys = {}
def kd(e): keys[e.keyCode] = True
def ku(e): keys[e.keyCode] = False
document.bind("keydown", kd)
document.bind("keyup", ku)

def update_physics():
    global is_grounded
    
    # 1. Apply Horizontal Movement (Input)
    if 87 in keys: velocity["z"] -= MOVE_SPEED # W
    if 83 in keys: velocity["z"] += MOVE_SPEED # S
    if 65 in keys: velocity["x"] -= MOVE_SPEED # A
    if 68 in keys: velocity["x"] += MOVE_SPEED # D
    
    # 2. Jump Logic (Spacebar)
    if 32 in keys and is_grounded:
        velocity["y"] = JUMP_FORCE
        is_grounded = False

    # 3. Apply Gravity
    if not is_grounded:
        velocity["y"] += GRAVITY
    
    # 4. Apply Friction (Stops the sliding feel)
    velocity["x"] *= FRICTION
    velocity["z"] *= FRICTION
    
    # 5. Update Positions
    pos["x"] += velocity["x"]
    pos["y"] += velocity["y"]
    pos["z"] += velocity["z"]
    
    # 6. Floor Collision (Simple)
    if pos["y"] < 1:
        pos["y"] = 1
        velocity["y"] = 0
        is_grounded = True

    # 7. Boundary Collision (The Walls)
    dist = (pos["x"]**2 + pos["z"]**2)**0.5
    if dist > 58:
        # Bounce off wall
        velocity["x"] *= -0.5
        velocity["z"] *= -0.5
        # Push back inside
        angle = window.math.atan2(pos["z"], pos["x"])
        pos["x"] = window.math.cos(angle) * 57.9
        pos["z"] = window.math.sin(angle) * 57.9

# This function links to your existing animation loop
def loop(t):
    update_physics()
    
    # Update Mesh
    player.position.set(pos["x"], pos["y"], pos["z"])
    
    # Camera Follow (Smooth)
    camera.position.lerp(THREE.Vector3.new(pos["x"], pos["y"] + 4, pos["z"] + 10), 0.1)
    camera.lookAt(player.position)
    
    renderer.render(scene, camera)
    window.requestAnimationFrame(loop)
