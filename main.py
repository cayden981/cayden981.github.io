from browser import window, document, timer

# --- THREE.JS SETUP ---
THREE = window.THREE
scene = THREE.Scene.new()
scene.background = THREE.Color.new(0x87CEEB)

camera = THREE.PerspectiveCamera.new(75, window.innerWidth/window.innerHeight, 0.1, 1000)
renderer = THREE.WebGLRenderer.new({"antialias": True})
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

# --- ENVIRONMENT ---
# Floor
floor = THREE.Mesh.new(
    THREE.PlaneGeometry.new(100, 100),
    THREE.MeshPhongMaterial.new({"color": 0x228B22})
)
floor.rotation.x = -1.57
scene.add(floor)

# The Stump
stump = THREE.Mesh.new(
    THREE.CylinderGeometry.new(5, 5, 8, 32),
    THREE.MeshPhongMaterial.new({"color": 0x5C4033})
)
stump.position.y = 4
scene.add(stump)

# The Computer
computer_obj = THREE.Mesh.new(
    THREE.BoxGeometry.new(1.5, 1, 0.5),
    THREE.MeshPhongMaterial.new({"color": 0x111111})
)
computer_obj.position.set(0, 2, -4)
scene.add(computer_obj)

# Lights
light = THREE.DirectionalLight.new(0xffffff, 1)
light.position.set(5, 10, 7)
scene.add(light)
scene.add(THREE.AmbientLight.new(0x404040))

# --- PLAYER ---
player_mesh = THREE.Mesh.new(
    THREE.SphereGeometry.new(0.6, 16, 16),
    THREE.MeshBasicMaterial.new({"color": 0x8B4513}) # Gorilla Brown
)
scene.add(player_mesh)

# Movement Variables
pos = {"x": 0, "z": 0}
speed = 0.25 # Adjusted for snappy movement
keys = {}

def on_keydown(ev): keys[ev.keyCode] = True
def on_keyup(ev): keys[ev.keyCode] = False

document.bind("keydown", on_keydown)
document.bind("keyup", on_keyup)

def update(t):
    # --- SNAPPY MOVEMENT (No Sliding) ---
    move_x = 0
    move_z = 0
    
    if 87 in keys: move_z -= 1 # W
    if 83 in keys: move_z += 1 # S
    if 65 in keys: move_x -= 1 # A
    if 68 in keys: move_x += 1 # D
    
    # Normalize movement so diagonal isn't faster
    if move_x != 0 or move_z != 0:
        pos["x"] += move_x * speed
        pos["z"] += move_z * speed

    # Apply Position
    player_mesh.position.set(pos["x"], 1, pos["z"])
    
    # Smooth Camera Follow
    camera.position.lerp(THREE.Vector3.new(pos["x"], 6, pos["z"] + 10), 0.1)
    camera.lookAt(player_mesh.position)

    # --- COMPUTER INTERACTION ---
    # Show screen only if VERY close to the computer
    dist = player_mesh.position.distanceTo(computer_obj.position)
    screen = document["computer-screen"]
    
    if dist < 2.5:
        if screen.style.display != "block":
            screen.style.display = "block"
            document["room-input"].focus()
    else:
        screen.style.display = "none"

    renderer.render(scene, camera)
    window.requestAnimationFrame(update)

window.requestAnimationFrame(update)
