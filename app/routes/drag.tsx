/* eslint-disable @typescript-eslint/no-explicit-any */
import type { MetaFunction } from "@remix-run/node";
import { useState } from "react";
import Draggable from 'react-draggable';


export const meta: MetaFunction = () => {
  return [
    { title: "Designer hud" },
    { name: "description", content: "Designer hud lab." },
  ];
};

export default function Drag() {
  return (
    <Box />
  );
}

function Box() {
  const [position, setPosition] = useState({
    x: 50, y: 100
  });

  const updatePosition = (delta: any) => {
    setPosition({
      x: delta.x,
      y: delta.y,
    })

  }
  return <Draggable
    onStart={(event, data) => { console.log('start', data)}}
    onDrag={(event, data) => { console.log('drag', data)}}
    onStop={(event, data) => { console.log('stop', data); updatePosition(data)}}
    position={position}
  >
    <div
      style={{
        position: "absolute",
        width: 50,
        height: 50,
        background: "#ccc",
      }}
    ></div>
  </Draggable>
}