/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/prop-types */
import type { Rock } from "@ruiapp/move-style";
import DesignerHudMeta from "./DesignerHudMeta";
import type { DesignerHudRockConfig, HudPosition, HudWidget } from "~/types/designer-hud-types";
import { MouseEventHandler, useCallback, useMemo, useRef, useState } from "react";
import { convertToEventHandlers } from "@ruiapp/react-renderer";

import DesignerHudWidget from "./DesignerHudWidget";
import { isPointInWidget } from "~/utils/position-utility";
import { findLast } from "lodash-es";

export default {
  Renderer(context, props: DesignerHudRockConfig) {
    const { style, width, height, widgets } = props;
    const [hoveredWidget, setHoveredWidget] = useState<HudWidget | null>(null);
    const [activeWidget, setActiveWidget] = useState<HudWidget | null>(null);

    const eventHandlers: Record<string, any> = convertToEventHandlers({ context, rockConfig: props });

    const refCtnr = useRef<HTMLDivElement>(null);
    const getPointerOffsetPosition = useCallback(
      (event: React.MouseEvent): HudPosition => {
        const div = refCtnr.current;
        if (!div) {
          return { left: 0, top: 0 };
        }
        return {
          left: event.clientX - div.offsetLeft,
          top: event.clientY - div.offsetTop,
        };
      },
      [refCtnr],
    );

    const onMouseDown: MouseEventHandler = useCallback(
      (event) => {
        const pointerPosition = getPointerOffsetPosition(event);

        const pointedWidget = findLast(widgets, isPointInWidget.bind(null, pointerPosition));
        if (activeWidget != pointedWidget) {
          setActiveWidget(pointedWidget || null);
          eventHandlers.onWidgetSelected(pointedWidget);
        }
      },
      [refCtnr, widgets, hoveredWidget],
    );

    const onMouseMove: MouseEventHandler = useCallback(
      (event) => {
        const pointerPosition = getPointerOffsetPosition(event);

        const pointedWidget = findLast(widgets, isPointInWidget.bind(null, pointerPosition));
        if (hoveredWidget != pointedWidget) {
          setHoveredWidget(pointedWidget || null);
        }
      },
      [refCtnr, widgets, hoveredWidget],
    );

    return (
      <div
        style={{
          ...getStyleHud(width, height),
          ...style,
        }}
        ref={refCtnr}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
      >
        {widgets &&
          widgets
            .filter((widget) => {
              return widget.$id === hoveredWidget?.$id || widget.$id === activeWidget?.$id;
            })
            .map((widget) => {
              const isHovered = widget.$id === hoveredWidget?.$id;
              const isActive = widget.$id === activeWidget?.$id;
              return (
                <DesignerHudWidget
                  key={widget.$id}
                  widgetId={widget.$id}
                  isHovered={isHovered}
                  isActive={isActive}
                  left={widget.left}
                  top={widget.top}
                  width={widget.width}
                  height={widget.height}
                  onActive={setActiveWidget.bind(null, widget)}
                  onWidgetRectChange={eventHandlers.onWidgetRectChange}
                />
              );
            })}
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
