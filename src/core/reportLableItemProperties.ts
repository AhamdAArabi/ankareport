import { Property } from "../components/propertyGrid/property";
import { IReportLableItem } from "./layout";
import StyleProperties from "./styleProperties";

export default class ReportLableItemProperties extends StyleProperties {

  constructor(defaultValues?: IReportLableItem) {
    super(defaultValues);
    
    if (!defaultValues) return;

    this.beginUpdate();

    this._text = defaultValues.text;
    this._binding = defaultValues.binding || "";

    this.endUpdate();
  }

  private _text = "";
  private _binding = "";

  get text() {
    return this._text;
  }
  get binding() {
    return this._binding;
  }

  set text(value: string) {
    const oldValue = this.text;
    this._text = value;
    this.emitOnChange("text", value, oldValue);
  }
  set binding(value: string) {
    const oldValue = this.binding;
    this._binding = value;
    this.emitOnChange("binding", value, oldValue);
  }

  getPropertyDefinitions(): Property[] {
    return [
      { field: "text", label: "Text", type: "string" },
      { field: "binding", label: "Binding", type: "string" },
      ...super.getPropertyDefinitions(),
    ];
  }
}
