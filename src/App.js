import { useEffect, useState } from "react";
import { joinRoom } from "trystero";

class PeerRoom {
  room = null;
  roomConfig = {};

  constructor(config, roomId) {
    this.roomConfig = config;
    this.room = joinRoom(this.roomConfig, roomId);
  }

  leaveRoom = () => {
    if (!this.room) return;
    this.room.leave();
  };

  onPeerJoin = (fn) => {
    if (!this.room) return;
    this.room.onPeerJoin((...args) => fn(...args));
  };

  onPeerLeave = (fn) => {
    if (!this.room) return;
    this.room.onPeerLeave((...args) => fn(...args));
  };

  makeAction = (namespace) => {
    return this.room.makeAction(namespace);
  };
}

function usePeerRoomAction(peerRoom, action) {
  const [peerRoomAction] = useState(() => peerRoom.makeAction(action));

  return peerRoomAction;
}

export default function App() {
  const [room] = useState(
    () =>
      new PeerRoom(
        {
          appId: "yolo-plop-yadi-yada"
        },
        "keghzekgnlzegdlhfezzzefkegekzg"
      )
  );

  const [sendDrink, getDrink] = usePeerRoomAction(room, "drink");

  useEffect(() => {
    return () => {
      room.leaveRoom();
    };
  }, [room]);

  useEffect(() => {
    getDrink((data, peerId) => console.log({ data, peerId }));
  }, [getDrink]);

  room.onPeerJoin((...props) => console.log("onPeerJoin", props));
  room.onPeerLeave((...props) => console.log("onPeerLeave", props));

  console.log({ room });

  return (
    <button
      onClick={() => {
        sendDrink({ drink: "negroni", withIce: true });
      }}
    >
      sendDrink
    </button>
  );
}
