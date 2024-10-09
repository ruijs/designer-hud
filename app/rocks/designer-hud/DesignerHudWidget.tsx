/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { MouseEventHandler, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { HudWidgetRectChangeEvent, HudRect, HudWidgetHandlerDraggingEvent } from "~/types/designer-hud-types";
import DesignerHudWidgetResizeHandler, { DragStartEventHandler } from "./DesignerHudWidgetResizeHandler";

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
  onShortKeyEventHandle: (payload: { type: string; widgetId: string }) => void;
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
  const { widgetId, isHovered, isActive, left, top, width, height, onActive, onWidgetRectChange, onShortKeyEventHandle } = props;
  const nodeRef = useRef(null);
  const [dragStartState, setDragStartState] = useState<DragStartState | null>();

  const styleIfHovered = isHovered ? styleHoveredItem : {};
  const styleIfActive = isActive ? styleActiveItem : {};
  let copyId = "";

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
      console.log("moseDown");

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

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
    const eventType = {
      ArrowDown: {
        key: "ArrowDown",
      },
      ArrowUp: {
        key: "ArrowUp",
      },
      ArrowRight: {
        key: "ArrowRight",
      },
      ArrowLeft: {
        key: "ArrowLeft",
      },
      copy: {
        key: "c",
        ctrlKey: true,
      },
      cut: {
        key: "x",
        ctrlKey: true,
      },
      paste: {
        key: "v",
        ctrlKey: true,
      },
      delete: {
        key: "Delete",
      },
    };

    if (event.type !== "keydown") return;
    event.preventDefault();
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();

    // move
    if (
      event.key === eventType.ArrowDown.key ||
      event.key === eventType.ArrowUp.key ||
      event.key === eventType.ArrowLeft.key ||
      event.key === eventType.ArrowRight.key
    ) {
      console.log("move", event);
      let leftVal = left;
      let topVal = top;
      const step = 1;

      if (event.key === eventType.ArrowDown.key) {
        topVal = topVal + step;
      }

      if (event.key === eventType.ArrowUp.key) {
        topVal = topVal - step;
      }

      if (event.key === eventType.ArrowLeft.key) {
        leftVal = leftVal - step;
      }

      if (event.key === eventType.ArrowRight.key) {
        leftVal = leftVal + step;
      }

      onWidgetRectChange({
        id: widgetId,
        left: leftVal,
        top: topVal,
        width: width,
        height: height,
      } as HudWidgetRectChangeEvent);
    }

    // copy
    if (event.key === eventType.copy.key && event.ctrlKey === eventType.copy.ctrlKey) {
      copyId = widgetId;
      onShortKeyEventHandle({
        widgetId,
        type: "copy",
      });
    }

    // cut
    if (event.key === eventType.cut.key && event.ctrlKey === eventType.cut.ctrlKey) {
      copyId = widgetId;
      onShortKeyEventHandle({
        widgetId,
        type: "cut",
      });
    }

    // paste
    if (event.key === eventType.paste.key && event.ctrlKey === eventType.paste.ctrlKey) {
      onShortKeyEventHandle({
        widgetId,
        type: "paste",
      });
    }

    // delete
    if (event.key === eventType.delete.key) {
      onShortKeyEventHandle({
        widgetId,
        type: "delete",
      });
    }
  };

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
      tabIndex={0}
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
      onKeyDown={onKeyDown}
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
