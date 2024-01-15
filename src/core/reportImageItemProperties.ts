import { Property } from "../components/propertyGrid/property";
import { IReportImageItem } from "./layout";
import StyleProperties from "./styleProperties";

export default class ReportImageItemProperties extends StyleProperties {


  constructor(defaultValues?: IReportImageItem) {
    super(defaultValues);
    
    if (!defaultValues) return;

    this.beginUpdate();

    this._src = defaultValues.src;

    this.endUpdate();
  }


  private _src:string = "";

  get src() {
    return this._src;
  }

  set src(value: string) {
    const oldValue = this.src;
    this._src = value;
    this.emitOnChange("text", value, oldValue);
  }

  getPropertyDefinitions(): Property[] {
    return [
      { field: "src", label: "Source", type: "string" },
      ...super.getPropertyDefinitions(),
    ];
  }
}
