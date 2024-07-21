/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { MouseEventHandler, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { HudWidgetRectChangeEvent, HudRect } from "~/types/designer-hud-types";
import DesignerHudWidgetResizeHandler, { DragStartEventHandler } from "./DesignerHudWidgetResizeHandler";
import { HudWidgetHandlerDraggingEvent } from "dist/rocks/designer-hud/designer-hud-types";

export type DesignerHudWidgetItem = {
  id: string;
};

export type DesignerHudWidgetProps = {
  widgetId: string;
  isHovered?: boolean;
  isActive?: boolean;
  onMouseEnter?: any;
  onMouseLeave?: any;
  onActive?: any;
  onWidgetRectChange: (payload: HudWidgetRectChangeEvent) => void;
} & HudRect;

export type DragStartState = {
  left: number;
  top: number;
  width: number;
  height: number;
  mouseClientX: number;
  mouseClientY: number;
};

export default function DesignerHudWidget(props: DesignerHudWidgetProps) {
  const { widgetId, isHovered, isActive, left, top, width, height, onActive, onWidgetRectChange } = props;
  const nodeRef = useRef(null);
  const [dragStartState, setDragStartState] = useState<DragStartState | null>();

  const styleIfHovered = isHovered ? styleHoveredItem : {};
  const styleIfActive = isActive ? styleActiveItem : {};

  const onMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!dragStartState) {
        return;
      }

      const deltaX = event.clientX - dragStartState?.mouseClientX;
      const deltaY = event.clientY - dragStartState?.mouseClientY;

      props.onWidgetRectChange({
        id: widgetId,
        left: dragStartState.left + deltaX,
        top: dragStartState.top + deltaY,
        width: width,
        height: height,
      });
    },
    [dragStartState, widgetId, width, height],
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

      onActive?.();

      setDragStartState({
        left: left,
        top: top,
        width: width,
        height: height,
        mouseClientX: event.clientX,
        mouseClientY: event.clientY,
      });
    },
    [onActive, setDragStartState],
  );

  const onResizeHandlerDragStart: DragStartEventHandler = useCallback((event) => {}, []);

  const onTopLeftHandlerDragging = useCallback(
    (event: HudWidgetHandlerDraggingEvent) => {
      onWidgetRectChange({
        id: widgetId,
        left: left + event.deltaX,
        top: top + event.deltaY,
        width: Math.max(width - event.deltaX, 0),
        height: Math.max(height - event.deltaY, 0),
      } as HudWidgetRectChangeEvent);
    },
    [onWidgetRectChange, widgetId, left, top, width, height],
  );

  const onTopRightHandlerDragging = useCallback(
    (event: HudWidgetHandlerDraggingEvent) => {
      onWidgetRectChange({
        id: widgetId,
        left: left,
        top: top + event.deltaY,
        width: Math.max(width + event.deltaX, 0),
        height: Math.max(height - event.deltaY, 0),
      } as HudWidgetRectChangeEvent);
    },
    [onWidgetRectChange, widgetId, left, top, width, height],
  );

  const onBottomRightHandlerDragging = useCallback(
    (event: HudWidgetHandlerDraggingEvent) => {
      onWidgetRectChange({
        id: widgetId,
        left: left,
        top: top,
        width: Math.max(width + event.deltaX, 0),
        height: Math.max(height + event.deltaY, 0),
      } as HudWidgetRectChangeEvent);
    },
    [onWidgetRectChange, widgetId, left, top, width, height],
  );

  const onBottomLeftHandlerDragging = useCallback(
    (event: HudWidgetHandlerDraggingEvent) => {
      onWidgetRectChange({
        id: widgetId,
        left: left + event.deltaX,
        top: top,
        width: Math.max(width - event.deltaX, 0),
        height: Math.max(height + event.deltaY, 0),
      } as HudWidgetRectChangeEvent);
    },
    [onWidgetRectChange, widgetId, left, top, width, height],
  );

  return (
    <div
      ref={nodeRef}
      style={{
        ...styleItem,
        ...styleIfHovered,
        ...styleIfActive,
        position: "absolute",
        width: width,
        height: height,
        left: left,
        top: top,
        zIndex: isActive ? 100 : 1,
      }}
      onMouseDown={onMouseDown}
    >
      {isActive && (
        <>
          <DesignerHudWidgetResizeHandler type="topLeft" left={-4} top={-4} onDragStart={onResizeHandlerDragStart} onDragging={onTopLeftHandlerDragging} />
          <DesignerHudWidgetResizeHandler
            type="topRight"
            left={width - 5}
            top={-4}
            onDragStart={onResizeHandlerDragStart}
            onDragging={onTopRightHandlerDragging}
          />
          <DesignerHudWidgetResizeHandler
            type="bottomRight"
            left={width - 5}
            top={height - 5}
            onDragStart={onResizeHandlerDragStart}
            onDragging={onBottomRightHandlerDragging}
          />
          <DesignerHudWidgetResizeHandler
            type="bottomLeft"
            left={-4}
            top={height - 5}
            onDragStart={onResizeHandlerDragStart}
            onDragging={onBottomLeftHandlerDragging}
          />
        </>
      )}
    </div>
  );
}

const primaryColor = `#C038FF`;

const styleItem: React.CSSProperties = {
  boxSizing: "border-box",
  position: "absolute",
};

const styleActiveItem: React.CSSProperties = {
  border: `1px solid ${primaryColor}`,
};

const styleHoveredItem: React.CSSProperties = {
  border: `1px solid ${primaryColor}`,
};
