/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Draggable, { DraggableEventHandler, DraggableProps } from 'react-draggable';
import { useRef } from 'react';
import { HudWidgetHandlerMovingEvent } from './designer-hud-types';

export type DesignerHudWidgetResizeHandlerType =
  | "topLeft"
  | "topRight"
  | "bottomLeft"
  | "bottomRight"
  | "top"
  | "left"
  | "bottom"
  | "right";

export type DesignerHudWidgetResizeHandlerPosition = {
  left: number;
  top: number;
}

export type DesignerHudWidgetResizeHandlerProps = {
  type: DesignerHudWidgetResizeHandlerType;
  position: DesignerHudWidgetResizeHandlerPosition;
  onMoving: (payload: HudWidgetHandlerMovingEvent) => void;
}

export default  function DesignerHudWidgetResizeHandler(props: DesignerHudWidgetResizeHandlerProps) {
  const { type, position } = props;
  const nodeRef = useRef(null);

  const onDragStart: DraggableEventHandler = (event) => {
    event.stopPropagation();
  }

  const onDrag: DraggableEventHandler = (event, data) => {
    props.onMoving({
      deltaX: data.deltaX,
      deltaY: data.deltaY,
    });
  }

  let styleOfHandlerType: React.CSSProperties = {};
  let dragAxis: DraggableProps["axis"] = 'both';
  if (type === "topLeft") {
    styleOfHandlerType = styleHandlerTopLeft;
  } else if (type === "topRight") {
    styleOfHandlerType = styleHandlerTopRight;
  } else if (type === "bottomLeft") {
    styleOfHandlerType = styleHandlerBottomLeft;
  } else if (type === "bottomRight") {
    styleOfHandlerType = styleHandlerBottomRight;
  } else if (type === "top") {
    styleOfHandlerType = styleHandlerTop;
    dragAxis = "y";
  } else if (type === "right") {
    styleOfHandlerType = styleHandlerRight;
    dragAxis = "x";
  } else if (type === "bottom") {
    styleOfHandlerType = styleHandlerBottom;
    dragAxis = "y";
  } else if (type === "left") {
    styleOfHandlerType = styleHandlerLeft;
    dragAxis = "x";
  }

  return <Draggable
    nodeRef={nodeRef}
    axis={dragAxis}
    onStart={onDragStart}
    onDrag={onDrag}
    position={{x: position.left, y: position.top }}
  >
    <div
      ref={nodeRef}
      style={{
        ...styleHandlerCommon,
        ...styleOfHandlerType,
        position: "absolute",
      }}
    >
    </div>
  </Draggable>
}

const primaryColor = `#C038FF`;

const styleHandlerCommon: React.CSSProperties = {
  boxSizing: "border-box",
  position: "absolute",
  width: "7px",
  height: "7px",
  border: `1px solid ${primaryColor}`,
  backgroundColor: "#fff",
  zIndex: 100,
}

const styleHandlerTopLeft: React.CSSProperties = {
  cursor: "nwse-resize",
}

const styleHandlerTopRight: React.CSSProperties = {
  cursor: "nesw-resize",
}

const styleHandlerBottomLeft: React.CSSProperties = {
  cursor: "nesw-resize",
}

const styleHandlerBottomRight: React.CSSProperties = {
  cursor: "nwse-resize",
}

const styleHandlerTop: React.CSSProperties = {
  cursor: "ns-resize",
}

const styleHandlerRight: React.CSSProperties = {
  cursor: "ew-resize",
}

const styleHandlerBottom: React.CSSProperties = {
  cursor: "ns-resize",
}

const styleHandlerLeft: React.CSSProperties = {
  cursor: "ew-resize",
}