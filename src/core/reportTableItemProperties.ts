import { Property } from "../components/propertyGrid/property";
import StyleProperties from "./styleProperties";

export default class ReportTableItemProperties extends StyleProperties {

  private _rowsNumber:number = 0;
  private _columnsNumber:number = 0;
  private _rowHeight:string = "";
  private _columnHeight:string = "";

  get rowsNumber() {
    return this._rowsNumber;
  }
  get columnsNumber() {
    return this._columnsNumber;
  }
  get rowHeight() {
    return this._rowHeight;
  }
  get columnHeight() {
    return this._columnHeight;
  }
 

  set rowsNumber(value: number) {
    const oldValue = this.rowsNumber;
    this._rowsNumber = value;
    this.emitOnChange("text", value, oldValue);
  }
  set columnsNumber(value: number) {
    const oldValue = this.columnsNumber;
    this._columnsNumber = value;
    this.emitOnChange("binding", value, oldValue);
  }
  set rowHeight(value: string) {
    const oldValue = this.rowHeight;
    this._rowHeight = value;
    this.emitOnChange("binding", value, oldValue);
  }
  set columnHeight(value: string) {
    const oldValue = this.columnHeight;
    this._columnHeight = value;
    this.emitOnChange("binding", value, oldValue);
  }

  getPropertyDefinitions(): Property[] {
    return [
      { field: "rowsNumber", label: "Rows Number", type: "string" },
      { field: "columnsNumber", label: "Columns Number", type: "string" },
      { field: "rowHeight", label: "Row Height", type: "string" },
      { field: "columnHeight", label: "Column Height", type: "string" },
      ...super.getPropertyDefinitions(),
    ];
  }
}
