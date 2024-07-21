import type { RockEventHandlerConfig, SimpleRockConfig } from "@ruiapp/move-style";

export interface DesignerHudRockConfig extends SimpleRockConfig {
  width: number;
  height: number;
  style?: React.CSSProperties;
  widgets: HudWidget[];
  onWidgetSelected: RockEventHandlerConfig;
  onWidgetRectChange: RockEventHandlerConfig;
}

export type HudSize = {
  width: number;
  height: number;
};

export type HudPosition = {
  top: number;
  left: number;
};

export type HudRect = HudSize & HudPosition;

export type HudWidget = HudSingleWidget;

export type HudSingleWidget = {
  type: "single";
  $id: string;
} & HudRect;

export type HudWidgetRectChangeEvent = {
  id: string;
  top: number;
  left: number;
  width: number;
  height: number;
};

export type HudWidgetHandlerDraggingEvent = {
  deltaX: number;
  deltaY: number;
};
