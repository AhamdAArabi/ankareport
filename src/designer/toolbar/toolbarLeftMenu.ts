import { ItemsTypes } from "../reportItemsFactory/base/reportItemsFactory";
import Toolbar, { ToolbarOrientation } from "./toolbar";
import ToolbarButton from "./toolbarButton";

export default class ToolbarLeftMenu extends Toolbar {
  public readonly labelButton: ToolbarButton;

  constructor() {
    super(ToolbarOrientation.Vertical);

    this.labelButton = this.addButton({
      text: "Ͳ",
      title: "Label",
      draggable: true,
      type: ItemsTypes.Label
    });
    this.labelButton = this.addButton({
      text: "📅",
      title: "Table",
      draggable: true,
      type: ItemsTypes.table
    });
    this.labelButton = this.addButton({
      text: "🖼️",
      title: "Image",
      draggable: true,
      type: ItemsTypes.image
    });
  }
}
