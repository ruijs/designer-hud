/* eslint-disable @typescript-eslint/no-explicit-any */
import type { MetaFunction } from "@remix-run/node";
import { Framework, Page, PageConfig } from "@ruiapp/move-style";
import { Rui } from "@ruiapp/react-renderer";
import { useMemo, useState } from "react";

import DesignerHudExtension, { DesignerHudRockConfig, HudWidgetRectChangeEvent } from "~/mod";
import { hudItemsFromRockChildrenConfig } from "~/rocks/designer-hud/RuiPageConnector";


const framework = new Framework();
framework.loadExtension(DesignerHudExtension);

export const meta: MetaFunction = () => {
  return [
    { title: "Designer hud" },
    { name: "description", content: "Designer hud lab." },
  ];
};

export default function Index() {
  const [designingPage] = useState(() => new Page(framework, {
    view: [
      {
        $id: "a",
        $type: "sfText",
        width: 100, height: 100,
        left: 30, top: 30,
      },
      {
        $id: "b",
        $type: "sfText",
        width: 150, height: 150,
        left: 30, top: 200,
      },
      {
        $id: "c",
        $type: "sfText",
        width: 100, height: 50,
        left: 150, top: 100,
      },
    ]
  } satisfies PageConfig));

  const designingPageConfig = designingPage.getConfig();

  const page = useMemo(() => {
    const ruiPageConfig: PageConfig = {
      view: [
        {
          $id: "designerHud",
          $type: "designerHud",
          width: 1200,
          height: 800,
          widgets: hudItemsFromRockChildrenConfig(designingPageConfig.view),
          onWidgetSelected: {
            $action: "script",
            script: (event: any) => {
              console.log(event);
            }
          },
          onWidgetRectChange: {
            $action: "script",
            script: (event: any) => {
              const widgetMovedPayload: HudWidgetRectChangeEvent = event.args[0];
              designingPage.setComponentProperties(widgetMovedPayload.id, {
                top: widgetMovedPayload.top,
                left: widgetMovedPayload.left,
                width: widgetMovedPayload.width,
                height: widgetMovedPayload.height,
              })
              page.setComponentProperties("designerHud", {
                widgets: hudItemsFromRockChildrenConfig(designingPage.getConfig().view),
              })
            }
          },
        } satisfies DesignerHudRockConfig,
      ]
    };
    return new Page(framework, ruiPageConfig);
  }, [designingPageConfig]);

  return (
    <div style={{width: "1200px", height: "800px", margin: "100px auto", border: "1px solid #000"}}>
      <Rui framework={framework} page={page} />
    </div>
  );
}
