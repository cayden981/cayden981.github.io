from browser import window, document, timer

# --- THREE.JS SETUP ---
THREE = window.THREE
scene = THREE.Scene.new()
scene.background = THREE.Color.new(0x87CEEB) # Sky Blue

camera = THREE.PerspectiveCamera.new(75, window.innerWidth/window.innerHeight, 0.1, 1000)
renderer = THREE.WebGLRenderer.new({"antialias": True})
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

# --- ENVIRONMENT ---
# The Ground
floor_geo = THREE.PlaneGeometry.new(100, 100)
floor_mat = THREE.MeshPhongMaterial.new({"color": 0x228B22})
floor = THREE.Mesh.new(floor_geo, floor_mat)
floor.rotation.x = -1.57
scene.add(floor)

# The Stump (Spawn Area)
stump_geo = THREE.CylinderGeometry.new(5, 5, 8, 32)
stump_mat = THREE.MeshPhongMaterial.new({"color": 0x5C4033})
stump = THREE.Mesh.new(stump_geo, stump_mat)
stump.position.y = 4
scene.add(stump)

# The Computer (Inside the Stump)
comp_geo = THREE.BoxGeometry.new(1, 1, 1)
comp_mat = THREE.MeshPhongMaterial.new({"color": 0x333333})
computer_obj = THREE.Mesh.new(comp_geo, comp_mat)
computer_obj.position.set(0, 2, -3)
scene.add(computer_obj)

# Lighting
light = THREE.DirectionalLight.new(0xffffff, 1)
light.position.set(5, 10, 7)
scene.add(light)
scene.add(THREE.AmbientLight.new(0x404040))

# --- PLAYER ---
player_geo = THREE.SphereGeometry.new(0.5, 16, 16)
player_mat = THREE.MeshBasicMaterial.new({"color": 0xff0000})
player_mesh = THREE.Mesh.new(player_geo, player_mat)
scene.add(player_mesh)

camera.position.set(0, 5, 10)
player_pos = {"x": 0, "z": 0}

# --- LOGIC ---
keys = {}

def on_keydown(ev): keys[ev.keyCode] = True
def on_keyup(ev): keys[ev.keyCode] = False

document.bind("keydown", on_keydown)
document.bind("keyup", on_keyup)

def update(t):
    # Movement
    if 87 in keys: player_pos["z"] -= 0.2 # W
    if 83 in keys: player_pos["z"] += 0.2 # S
    if 65 in keys: player_pos["x"] -= 0.2 # A
    if 68 in keys: player_pos["x"] += 0.2 # D

    player_mesh.position.set(player_pos["x"], 1, player_pos["z"])
    camera.position.set(player_pos["x"], 6, player_pos["z"] + 10)
    camera.lookAt(player_mesh.position)

    # Check if near computer
    dist = player_mesh.position.distanceTo(computer_obj.position)
    if dist < 3:
        document["computer-screen"].style.display = "block"
    else:
        document["computer-screen"].style.display = "none"

    renderer.render(scene, camera)
    window.requestAnimationFrame(update)

# Start Game
window.requestAnimationFrame(update)
