from browser import document, window, timer, html

canvas = document["gameCanvas"]
ctx = canvas.getContext("2d")
status = document["status"]

# Game State
player = {"x": 50, "y": 50, "color": "green"}
others = {} # Dictionary to hold other players
my_id = ""

def on_open(id):
    global my_id
    my_id = id
    status.text = f"My Private ID: {id}"

# PeerJS Setup
peer = window.Peer.new()
peer.on('open', on_open)

def handle_data(data):
    # When we receive a position from another player
    import json
    msg = json.loads(data)
    others[msg['id']] = msg

@peer.on('connection')
def setup_conn(conn):
    @conn.on('data')
    def incoming(data):
        handle_data(data)

def join_room(ev):
    target_id = document["roomInput"].value
    conn = peer.connect(target_id)
    status.text = f"Connecting to {target_id}..."
    
    @conn.on('open')
    def ready():
        status.text = f"Connected to: {target_id}"
        # Send our position every 100ms
        def send_pos():
            import json
            conn.send(json.dumps({"id": my_id, "x": player["x"], "y": player["y"]}))
        timer.set_interval(send_pos, 100)

document["joinBtn"].bind("click", join_room)

def update_game():
    # Clear Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    # Draw Me (The Gorilla)
    ctx.fillStyle = player["color"]
    ctx.fillRect(player["x"], player["y"], 30, 30)
    
    # Draw Others
    ctx.fillStyle = "red"
    for p_id in others:
        other = others[p_id]
        ctx.fillRect(other["x"], other["y"], 30, 30)

def move_player(ev):
    if ev.keyCode == 37: player["x"] -= 10 # Left
    if ev.keyCode == 39: player["x"] += 10 # Right
    if ev.keyCode == 38: player["y"] -= 10 # Up
    if ev.keyCode == 40: player["y"] += 10 # Down

document.bind("keydown", move_player)
timer.set_interval(update_game, 30)
