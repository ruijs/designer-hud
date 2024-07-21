import { HudWidget } from "~/types/designer-hud-types";

export type Position = {
  left: number;
  top: number;
};

export type Size = {
  width: number;
  height: number;
};

export type Rect = Position & Size;

export function isPointInWidget(point: Position, rect: HudWidget) {
  return point.left >= rect.left && point.left <= rect.left + rect.width && point.top >= rect.top && point.top <= rect.top + rect.height;
}
