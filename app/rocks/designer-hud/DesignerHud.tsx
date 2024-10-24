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
import _ from "lodash";

export default {
  Renderer(context, props: DesignerHudRockConfig) {
    const { style, width, height, widgets } = props;
    const [hoveredWidgetId, setHoveredWidgetId] = useState<string | null>(null);
    const [activeWidgetId, setActiveWidgetId] = useState<string | null>(null);

    const eventHandlers: Record<string, any> = convertToEventHandlers({ context, rockConfig: props });

    const refCtnr = useRef<HTMLDivElement>(null);
    const getPointerOffsetPosition = useCallback(
      (event: React.MouseEvent): HudPosition => {
        const div = refCtnr.current;
        if (!div) {
          return { left: 0, top: 0 };
        }

        const clientRect = div.getBoundingClientRect();
        return {
          left: event.clientX - clientRect.left,
          top: event.clientY - clientRect.top,
        };
      },
      [refCtnr],
    );

    const onMouseDown: MouseEventHandler = useCallback(
      (event) => {
        const pointerPosition = getPointerOffsetPosition(event);

        const pointedWidget = _.findLast(widgets, isPointInWidget.bind(null, pointerPosition));
        setActiveWidget(pointedWidget);
      },
      [refCtnr, widgets, hoveredWidgetId, eventHandlers],
    );

    const onMouseMove: MouseEventHandler = useCallback(
      (event) => {
        const pointerPosition = getPointerOffsetPosition(event);

        const pointedWidget = _.findLast(widgets, isPointInWidget.bind(null, pointerPosition));
        if (pointedWidget) {
          if (pointedWidget.$id !== hoveredWidgetId) {
            setHoveredWidgetId(pointedWidget.$id);
          }
        } else {
          if (hoveredWidgetId) {
            setHoveredWidgetId(null);
          }
        }
      },
      [refCtnr, widgets, hoveredWidgetId],
    );

    const setActiveWidget = (widget: HudWidget | undefined) => {
      if (widget) {
        if (widget.$id !== activeWidgetId) {
          eventHandlers.onWidgetSelected(widget);
          setActiveWidgetId(widget.$id);
        }
      } else {
        if (activeWidgetId) {
          eventHandlers.onWidgetSelected(null);
          setActiveWidgetId(null);
        }
      }
    };

    const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
      const eventType = {
        quash: {
          key: "z",
          ctrlKey: true,
        },
        redo: {
          key: "y",
          ctrlKey: true,
        },
      };

      if (event.type !== "keydown") return;

      event.preventDefault();
      event.stopPropagation();
      event.nativeEvent.stopImmediatePropagation();

      // paste
      if (event.key === eventType.quash.key && event.ctrlKey === eventType.quash.ctrlKey) {
        console.log("quash");
        eventHandlers.onShortKeyEventHandle({
          type: "quash",
        });
      }

      // redo
      if (event.key === eventType.redo.key && event.ctrlKey === eventType.redo.ctrlKey) {
        eventHandlers.onShortKeyEventHandle({
          type: "redo",
        });
      }
    };

    return (
      <div
        style={{
          ...getStyleHud(width, height),
          ...style,
        }}
        tabIndex={0}
        ref={refCtnr}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onKeyDown={onKeyDown}
      >
        {widgets &&
          widgets
            .filter((widget) => {
              return widget.$id === hoveredWidgetId || widget.$id === activeWidgetId;
            })
            .map((widget) => {
              const isHovered = widget.$id === hoveredWidgetId;
              const isActive = widget.$id === activeWidgetId;
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
                  onShortKeyEventHandle={eventHandlers.onShortKeyEventHandle}
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
