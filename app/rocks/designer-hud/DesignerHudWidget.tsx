/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef } from "react";
import Draggable, { DraggableEventHandler } from 'react-draggable';
import { HudWidgetPosition, HudWidgetRectChangeEvent, HudWidgetSize } from "./designer-hud-types";

export type DesignerHudWidgetItem = {
  id: string;
}

export type DesignerHudWidgetProps = {
  item: DesignerHudWidgetItem;
  size: HudWidgetSize;
  position: HudWidgetPosition;
  isHovered?: boolean;
  isActive?: boolean;
  onMouseEnter: any;
  onMouseLeave: any;
  onActive: any;
  onWidgetRectChange: (payload: HudWidgetRectChangeEvent) => void;
}

export default  function DesignerHudWidget(props: DesignerHudWidgetProps) {
  const { isHovered, isActive, size, position } = props;
  const nodeRef = useRef(null);

  const onDragStart: DraggableEventHandler = (event) => {
    event.stopPropagation();
    props.onActive();
  }

  const onDrag: DraggableEventHandler = (event, data) => {
    props.onWidgetRectChange({
      id: props.item.id,
      left: data.x,
      top: data.y,
      width: props.size.width,
      height: props.size.height,
    });
  }

  const onDragStop: DraggableEventHandler = (event, data) => {
    props.onWidgetRectChange({
      id: props.item.id,
      left: data.x,
      top: data.y,
      width: props.size.width,
      height: props.size.height,
    });
  }

  const styleIfHovered = isHovered ? styleHoveredItem : {};
  const styleIfActive = isActive ? styleActiveItem : {};

  return <Draggable
    nodeRef={nodeRef}
    onStart={onDragStart}
    onDrag={onDrag}
    onStop={onDragStop}
    position={{x: position.left, y: position.top }}
  >
    <div
      ref={nodeRef}
      style={{
        ...styleItem,
        ...styleIfHovered,
        ...styleIfActive,
        position: "absolute",
        width: size.width,
        height: size.height,
        zIndex: isActive ? 100 : 1,
      }}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
    >
    </div>
  </Draggable>
}


const primaryColor = `#C038FF`;


const styleItem: React.CSSProperties = {
  boxSizing: "border-box",
  position: "absolute",
}

const styleActiveItem: React.CSSProperties = {
  border: `1px solid ${primaryColor}`,
}

const styleHoveredItem: React.CSSProperties = {
  border: `1px solid ${primaryColor}`,
}
