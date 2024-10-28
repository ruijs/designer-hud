/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { MouseEventHandler, useCallback, useEffect, useRef, useState } from "react";
import { HudWidgetHandlerDraggingEvent } from "../../types/designer-hud-types";

export type DesignerHudWidgetResizeHandlerType = "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | "top" | "left" | "bottom" | "right";

export type DragStartState = {
  mouseClientX: number;
  mouseClientY: number;
};

export type DragStartEventHandler = (event: DragStartState) => void;

export type DesignerHudWidgetResizeHandlerProps = {
  type: DesignerHudWidgetResizeHandlerType;
  left?: number;
  top?: number;
  right?: number;
  bottom?: number;
  onDragStart: (event: DragStartState) => void;
  onDragging: (event: HudWidgetHandlerDraggingEvent) => void;
};

export default function DesignerHudWidgetResizeHandler(props: DesignerHudWidgetResizeHandlerProps) {
  const { type, left, top, right, bottom, onDragStart, onDragging } = props;
  const nodeRef = useRef(null);
  const [dragStartState, setDragStartState] = useState<DragStartState | null>();

  const onMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!dragStartState) {
        return;
      }

      const deltaX = event.clientX - dragStartState?.mouseClientX;
      const deltaY = event.clientY - dragStartState?.mouseClientY;
      onDragging({
        deltaX,
        deltaY,
      });
    },
    [dragStartState, onDragging],
  );

  const onMouseUp = useCallback(
    (event: MouseEvent) => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    },
    [onMouseMove],
  );

  useEffect(() => {
    if (dragStartState) {
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    }
  }, [dragStartState]);

  const onMouseDown: MouseEventHandler = useCallback(
    (event) => {
      event.stopPropagation();

      const state = {
        mouseClientX: event.clientX,
        mouseClientY: event.clientY,
      };
      setDragStartState(state);

      onDragStart?.(state);
    },
    [onDragStart, setDragStartState],
  );

  let styleOfHandlerType: React.CSSProperties = {};
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
  } else if (type === "right") {
    styleOfHandlerType = styleHandlerRight;
  } else if (type === "bottom") {
    styleOfHandlerType = styleHandlerBottom;
  } else if (type === "left") {
    styleOfHandlerType = styleHandlerLeft;
  }

  return (
    <div
      ref={nodeRef}
      style={{
        ...styleHandlerCommon,
        ...styleOfHandlerType,
        position: "absolute",
        top,
        left,
      }}
      onMouseDown={onMouseDown}
    ></div>
  );
}

const primaryColor = `#C038FF`;

const styleHandlerCommon: React.CSSProperties = {
  boxSizing: "border-box",
  position: "absolute",
  width: 7,
  height: 7,
  border: `1px solid ${primaryColor}`,
  backgroundColor: "#fff",
  zIndex: 100,
};

const styleHandlerTopLeft: React.CSSProperties = {
  cursor: "nwse-resize",
};

const styleHandlerTopRight: React.CSSProperties = {
  cursor: "nesw-resize",
};

const styleHandlerBottomLeft: React.CSSProperties = {
  cursor: "nesw-resize",
};

const styleHandlerBottomRight: React.CSSProperties = {
  cursor: "nwse-resize",
};

const styleHandlerTop: React.CSSProperties = {
  cursor: "ns-resize",
};

const styleHandlerRight: React.CSSProperties = {
  cursor: "ew-resize",
};

const styleHandlerBottom: React.CSSProperties = {
  cursor: "ns-resize",
};

const styleHandlerLeft: React.CSSProperties = {
  cursor: "ew-resize",
};
