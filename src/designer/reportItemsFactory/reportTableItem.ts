import { IReportTableItem as LayoutReportTableItem } from "../../core/layout";
import { ChangeEventArgs } from "../../core/properties";
import ReportTableItemProperties from "../../core/reportTableItemProperties";
import styleProperties, { TextAlign } from "../../core/styleProperties";
import { MultipleStyles } from "../../core/utils/style.utils";
import ReportItemsFactory, { ReportItemsFactoryOptions } from "./base/reportItemsFactory";


export interface ReportLableItemOptions extends ReportItemsFactoryOptions {
  defaultProperties: Partial<LayoutReportTableItem>;
}

export default class ReportTableItem extends ReportItemsFactory {

  private readonly _styles: MultipleStyles;
  private readonly _properties: ReportTableItemProperties;


  constructor(options: ReportItemsFactoryOptions) {
    super(options);
    debugger

    this._properties = new ReportTableItemProperties();
    this._properties =  this.properties as ReportTableItemProperties;

    this._styles = new MultipleStyles(...options.parentStyles, this._properties, this.properties);

    if (options.defaultProperties) {
      this.loadLayout(options.defaultProperties);
    }

    this.init();
  }

   init() {
    debugger
    const headersRow: HTMLElement = document.createElement("tr");
    const headers: Array<HTMLElement> = [];
    const header: HTMLElement = document.createElement("th")
    header.innerText = "Header";
    header.style.border = "1px solid black"
    headers.push(header);
    headersRow.append(...headers);
    
    const dataRow: HTMLElement = document.createElement("tr");
    const dataElements: Array<HTMLElement> = [];
    const data: HTMLElement = document.createElement("td")
    data.innerText = "Data";
    data.style.border = "1px solid black"
    dataElements.push(data);
    dataRow.append(...dataElements);

    this.element.append(headersRow, dataRow);
     
    this.element.tabIndex = 0;
    this.element.style.display = "table";
    this.element.style.position = "absolute";
    this.element.style.userSelect = "none";
    this.element.style.outline = "none";
    this.element.style.whiteSpace = "nowrap";
    this.element.style.overflow = "hidden";
    this.element.style.textOverflow = "ellipsis";

    this._styles.getList().forEach((styles) => {
      styles.addEventListener("change", () => this.refresh());
    });
    this._properties.addEventListener("change", (e) => this._onChange(e));

    this.refresh();
  }

  refresh() {
    this.element.style.left = `${this._properties.x}px`;
    this.element.style.top = `${this._properties.y}px`;
    debugger
    this.element.style.width = `${this._properties.width}px`;
    this.element.style.height = `${this._properties.height}px`;
    // this.element.innerText = this._properties.text;

    this.element.style.color = this._styles.getStyle("color", "")!;
    this.element.style.backgroundColor = this._styles.getStyle(
      "backgroundColor",
      "",
    )!;
    this.element.style.textAlign = this._styles.getStyle("textAlign", "")!;
    this.element.style.borderWidth =
      this._styles.getStyle("borderWidth", "0")! + "px";
    this.element.style.borderStyle = this._styles.getStyle("borderStyle", "")!;
    this.element.style.borderColor = this._styles.getStyle(
      "borderColor",
      "#000000",
    )!;
    this.element.style.fontFamily = this._styles.getStyle(
      "fontFamily",
      "Tahoma",
    )!;
    this.element.style.fontSize = this._styles.getStyle("fontSize", "12px")!;
    this.element.style.fontWeight = this._styles.getStyle("fontWeight", "")!;
  }


  loadLayout(layout: Partial<LayoutReportTableItem>) {
    this._properties.beginUpdate();
    this._properties.x = layout.x ?? 0;
    this._properties.y = layout.y ?? 0;
    this._properties.width = layout.width ?? 0;
    this._properties.height = layout.height ?? 0;
    this._properties.name = layout.name ?? "";
    this._properties.color = layout.color;
    this._properties.backgroundColor = layout.backgroundColor;
    this._properties.textAlign = layout.textAlign as TextAlign;
    this._properties.borderWidth = layout.borderWidth;
    this._properties.borderStyle = layout.borderStyle;
    this._properties.borderColor = layout.borderColor;
    this._properties.fontFamily = layout.fontFamily;
    this._properties.fontSize = layout.fontSize;
    this._properties.fontWeight = layout.fontWeight;
    this._properties.endUpdate();

    this.refresh();
  }

  toJSON(): LayoutReportTableItem {
    return {
      x: this._properties.x,
      y: this._properties.y,
      width: this._properties.width,
      height: this._properties.height,
      name: this._properties.name,
      color: this._properties.color,
      backgroundColor: this._properties.backgroundColor,
      textAlign: this._properties.textAlign,
      borderWidth: this._properties.borderWidth,
      borderStyle: this._properties.borderStyle,
      borderColor: this._properties.borderColor,
      fontFamily: this._properties.fontFamily,
      fontSize: this._properties.fontSize,
      fontWeight: this._properties.fontWeight,
      type: this.element.tagName,
      ColumnHeight: this._properties.columnHeight,
      RowHeight: this._properties.rowHeight,
      RowsNumber: this._properties.rowsNumber,
      ColumnsNumber: this._properties.columnsNumber,
    };
  }

  private _onChange(args: ChangeEventArgs) {
    this._changeEventEmitter.emit(args);
  }
}
