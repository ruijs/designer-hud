/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/prop-types */
import type { Rock } from "@ruiapp/move-style";
import DesignerHudMeta from "./DesignerHudMeta";
import type { DesignerHudRockConfig, HudRect, HudWidgetHandlerMovingEvent, HudWidgetRectChangeEvent } from "./designer-hud-types";
import { useMemo, useState } from "react";
import { convertToEventHandlers } from "@ruiapp/react-renderer";

import DesignerHudWidget from "./DesignerHudWidget";
import DesignerHudWidgetResizeHandler, { DesignerHudWidgetResizeHandlerPosition } from "./DesignerHudWidgetResizeHandler";

export default {
  Renderer(context, props: DesignerHudRockConfig) {
    const { style, width, height, widgets } = props;
    const [hoveredWidgetId, setHoveredWidgetId] = useState<string | null>(null);
    const [activeWidgetId, setActiveWidgetId] = useState<string | null>(null);

    const eventHandlers: Record<string, any> = convertToEventHandlers({ context, rockConfig: props });

    const setActiveWidget = (componentId: string) => {
      if (activeWidgetId === componentId) {
        return;
      }

      setActiveWidgetId(componentId);
      eventHandlers.onWidgetSelected(componentId);
    };

    const selectedWidgets = useMemo(() => {
      return widgets.filter((widget) => widget.id === activeWidgetId);
    }, [activeWidgetId, widgets]);

    const selectedRect: HudRect | null = useMemo(() => {
      if (!selectedWidgets || !selectedWidgets.length) {
        return null;
      }

      return {
        position: selectedWidgets[0].position,
        size: selectedWidgets[0].size,
      };
    }, [selectedWidgets]);

    const onTopLeftHandlerMoving = (event: HudWidgetHandlerMovingEvent) => {
      if (!selectedRect) {
        return;
      }

      eventHandlers.onWidgetRectChange({
        id: activeWidgetId,
        left: selectedRect.position.left + event.deltaX,
        top: selectedRect.position.top + event.deltaY,
        width: Math.max(selectedRect.size.width - event.deltaX, 0),
        height: Math.max(selectedRect.size.height - event.deltaY, 0),
      } as HudWidgetRectChangeEvent);
    };

    const onTopRightHandlerMoving = (event: HudWidgetHandlerMovingEvent) => {
      if (!selectedRect) {
        return;
      }

      eventHandlers.onWidgetRectChange({
        id: activeWidgetId,
        left: selectedRect.position.left,
        top: selectedRect.position.top + event.deltaY,
        width: Math.max(selectedRect.size.width + event.deltaX, 0),
        height: Math.max(selectedRect.size.height - event.deltaY, 0),
      } as HudWidgetRectChangeEvent);
    };

    const onBottomRightHandlerMoving = (event: HudWidgetHandlerMovingEvent) => {
      if (!selectedRect) {
        return;
      }

      eventHandlers.onWidgetRectChange({
        id: activeWidgetId,
        left: selectedRect.position.left,
        top: selectedRect.position.top,
        width: Math.max(selectedRect.size.width + event.deltaX, 0),
        height: Math.max(selectedRect.size.height + event.deltaY, 0),
      } as HudWidgetRectChangeEvent);
    };

    const onBottomLeftHandlerMoving = (event: HudWidgetHandlerMovingEvent) => {
      if (!selectedRect) {
        return;
      }

      eventHandlers.onWidgetRectChange({
        id: activeWidgetId,
        left: selectedRect.position.left + event.deltaX,
        top: selectedRect.position.top,
        width: Math.max(selectedRect.size.width - event.deltaX, 0),
        height: Math.max(selectedRect.size.height + event.deltaY, 0),
      } as HudWidgetRectChangeEvent);
    };

    const topLeftHandlerPos: DesignerHudWidgetResizeHandlerPosition | null = useMemo(() => {
      if (!selectedRect) {
        return null;
      }

      return {
        top: selectedRect.position.top - 3,
        left: selectedRect.position.left - 3,
      };
    }, [selectedRect]);

    const topRightHandlerPos: DesignerHudWidgetResizeHandlerPosition | null = useMemo(() => {
      if (!selectedRect) {
        return null;
      }

      return {
        top: selectedRect.position.top - 3,
        left: selectedRect.position.left + selectedRect.size.width - 4,
      };
    }, [selectedRect]);

    const bottomRightHandlerPos: DesignerHudWidgetResizeHandlerPosition | null = useMemo(() => {
      if (!selectedRect) {
        return null;
      }

      return {
        top: selectedRect.position.top + selectedRect.size.height - 4,
        left: selectedRect.position.left + selectedRect.size.width - 4,
      };
    }, [selectedRect]);

    const bottomLeftHandlerPos: DesignerHudWidgetResizeHandlerPosition | null = useMemo(() => {
      if (!selectedRect) {
        return null;
      }

      return {
        top: selectedRect.position.top + selectedRect.size.height - 4,
        left: selectedRect.position.left - 3,
      };
    }, [selectedRect]);

    return (
      <div
        style={{
          ...getStyleHud(width, height),
          ...style,
        }}
      >
        {widgets &&
          widgets.map((widget) => {
            const isHovered = widget.id === hoveredWidgetId;
            const isActive = widget.id === activeWidgetId;
            return (
              <DesignerHudWidget
                key={widget.id}
                item={{ id: widget.id }}
                isHovered={isHovered}
                isActive={isActive}
                position={widget.position}
                size={widget.size}
                onMouseEnter={() => setHoveredWidgetId(widget.id)}
                onMouseLeave={() => setHoveredWidgetId(null)}
                onActive={setActiveWidget.bind(null, widget.id)}
                onWidgetRectChange={eventHandlers.onWidgetRectChange}
              />
            );
          })}
        {selectedRect && (
          <>
            <DesignerHudWidgetResizeHandler type="topLeft" position={topLeftHandlerPos!} onMoving={onTopLeftHandlerMoving} />
            <DesignerHudWidgetResizeHandler type="topRight" position={topRightHandlerPos!} onMoving={onTopRightHandlerMoving} />
            <DesignerHudWidgetResizeHandler type="bottomRight" position={bottomRightHandlerPos!} onMoving={onBottomRightHandlerMoving} />
            <DesignerHudWidgetResizeHandler type="bottomLeft" position={bottomLeftHandlerPos!} onMoving={onBottomLeftHandlerMoving} />
          </>
        )}
      </div>
    );
  },

  ...DesignerHudMeta,
} as Rock;

function getStyleHud(width: number, height: number) {
  const style: React.CSSProperties = {
    position: "absolute",
    width: `${width}px`,
    height: `${height}px`,
  };
  return style;
}
