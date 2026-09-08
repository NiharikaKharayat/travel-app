from fastapi import WebSocket


class ConnectionManager:

    def __init__(self):

        # Store rooms and users

        self.active_connections = {}


    # ========================================
    # CONNECT USER
    # ========================================

    async def connect(
        self,
        websocket: WebSocket,
        room_id: str
    ):

        await websocket.accept()


        if room_id not in self.active_connections:

            self.active_connections[room_id] = []


        self.active_connections[room_id].append(
            websocket
        )


        print(
            f"User connected to room: {room_id}"
        )


    # ========================================
    # DISCONNECT USER
    # ========================================

    def disconnect(
        self,
        websocket: WebSocket,
        room_id: str
    ):

        if room_id in self.active_connections:

            if websocket in self.active_connections[room_id]:

                self.active_connections[room_id].remove(
                    websocket
                )


            # Remove empty rooms

            if len(
                self.active_connections[room_id]
            ) == 0:

                del self.active_connections[room_id]


        print(
            f"User disconnected from room: {room_id}"
        )


    # ========================================
    # BROADCAST MESSAGE
    # ========================================

    async def broadcast(
        self,
        room_id: str,
        message: dict
    ):

        if room_id not in self.active_connections:

            return


        disconnected_users = []


        for connection in self.active_connections[room_id]:

            try:

                await connection.send_json(
                    message
                )

            except:

                disconnected_users.append(
                    connection
                )


        # Remove disconnected users

        for user in disconnected_users:

            if user in self.active_connections[room_id]:

                self.active_connections[room_id].remove(
                    user
                )