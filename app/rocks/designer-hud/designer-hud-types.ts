import type { RockEventHandlerConfig, SimpleRockConfig } from "@ruiapp/move-style";

export interface DesignerHudRockConfig extends SimpleRockConfig {
  width: number;
  height: number;
  style?: React.CSSProperties;
  widgets: HudWidget[];
  onWidgetSelected: RockEventHandlerConfig;
  onWidgetRectChange: RockEventHandlerConfig;
}

export type HudWidgetSize = {
  width: number;
  height: number;
};

export type HudWidgetPosition = {
  top: number;
  left: number;
};

export type HudRect = {
  size: HudWidgetSize;
  position: HudWidgetPosition;
};

export type HudWidget = HudSingleWidget;

export type HudSingleWidget = {
  type: "single";
  id: string;
  size: HudWidgetSize;
  position: HudWidgetPosition;
};

export type HudWidgetRectChangeEvent = {
  id: string;
  top: number;
  left: number;
  width: number;
  height: number;
};

export type HudWidgetHandlerMovingEvent = {
  deltaX: number;
  deltaY: number;
};
