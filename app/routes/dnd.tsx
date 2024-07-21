/* eslint-disable @typescript-eslint/no-explicit-any */
import type { MetaFunction } from "@remix-run/node";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export const meta: MetaFunction = () => {
  return [{ title: "Designer hud" }, { name: "description", content: "Designer hud lab." }];
};

export default function Dnd() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Container />
      <ForbiddenContainer />
      <Cube name="foo" />
    </DndProvider>
  );
}

export function Cube(props: { name: string }) {
  const [collected, drag, preview] = useDrag(() => ({
    type: "box",
    item: { name: props.name },
    previewOptions: {
      captureDraggingState: false,
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
      initialOffset: monitor.getInitialClientOffset(),
      clientOffset: monitor.getClientOffset(),
      difference: monitor.getDifferenceFromInitialOffset(),
    }),
  }));

  console.log("initialOffset", collected.initialOffset);
  console.log("clientOffset", collected.clientOffset);
  console.log("difference", collected.difference);

  return collected.isDragging ? (
    <div
      ref={preview}
      style={{
        opacity: collected.isDragging ? 1 : 1,
        position: "absolute",
        top: 30,
        left: 30,
        width: "50px",
        height: "50px",
        backgroundColor: collected.isDragging ? "#f00" : "#ccc",
        cursor: "move",
      }}
    >
      Drop me
    </div>
  ) : (
    <div
      ref={drag}
      style={{
        position: "absolute",
        top: 30,
        left: 30,
        width: "50px",
        height: "50px",
        backgroundColor: collected.isDragging ? "#f00" : "#ccc",
        cursor: "move",
      }}
    >
      Drag me
    </div>
  );
}

export function Preview() {
  const [{ isDragging, initialOffset }, drag] = useDrag(() => ({
    type: "box",
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
      initialOffset: monitor.getInitialClientOffset(),
    }),
  }));

  console.log(initialOffset);

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        width: "50px",
        height: "50px",
        backgroundColor: isDragging ? "#f00" : "#ccc",
        cursor: "move",
      }}
    ></div>
  );
}

export function Container() {
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: "box",
      drop: (item: any) => alert(`${item.name} dropped`),
      canDrop: () => true,
      collect: (monitor) => ({
        canDrop: !!monitor.canDrop(),
        isOver: !!monitor.isOver(),
      }),
    }),
    [],
  );

  return (
    <div
      ref={drop}
      style={{
        width: "400px",
        height: "400px",
        position: "absolute",
        top: "100px",
        left: "100px",
        border: "1px solid #000",
        backgroundColor: isOver ? "#00AD19" : canDrop ? "#52FF6A" : "#fff",
      }}
    ></div>
  );
}

export function ForbiddenContainer() {
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: "box",
      drop: () => alert("dropped"),
      canDrop: () => false,
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    [],
  );

  return (
    <div
      ref={drop}
      style={{
        width: "400px",
        height: "400px",
        position: "absolute",
        top: "100px",
        left: "600px",
        border: "1px solid #000",
        backgroundColor: isOver ? (canDrop ? "#ccc" : "#f00") : canDrop ? "#52FF6A" : "#ccc",
      }}
    ></div>
  );
}
