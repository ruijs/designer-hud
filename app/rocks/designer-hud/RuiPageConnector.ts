import { RockConfig } from "@ruiapp/move-style";
import { HudWidget } from "../../types/designer-hud-types";

export function hudItemsFromRockChildrenConfig(children: RockConfig[]) {
  const items: HudWidget[] = [];

  for (const childConfig of children) {
    items.push({
      type: "single",
      $id: childConfig.$id!,
      width: parseInt(childConfig.width, 10) || 0,
      height: parseInt(childConfig.height, 10) || 0,
      left: parseInt(childConfig.left, 10) || 0,
      top: parseInt(childConfig.top, 10) || 0,
    });
  }

  return items;
}
