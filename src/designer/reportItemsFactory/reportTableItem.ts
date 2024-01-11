import { IReportTableItem, IReportTableItem as LayoutReportTableItem } from "../../core/layout";
import { ChangeEventArgs } from "../../core/properties";
import ReportTableItemProperties from "../../core/reportTableItemProperties";
import StyleProperties from "../../core/styleProperties";
import styleProperties, { TextAlign } from "../../core/styleProperties";
import { MultipleStyles } from "../../core/utils/style.utils";
import ReportItemsFactory, { ReportItemsFactoryOptions } from "./base/reportItemsFactory";


export interface ReportLableItemOptions extends ReportItemsFactoryOptions {
  defaultProperties: Partial<LayoutReportTableItem>;
}

export default class ReportTableItem extends ReportItemsFactory {

  private readonly _styles: MultipleStyles;
  public properties: ReportTableItemProperties;


  constructor(options: ReportItemsFactoryOptions) {
    super(options);

    this.properties = new ReportTableItemProperties(options.defaultProperties as IReportTableItem);

    this._styles = new MultipleStyles(...options.parentStyles, this.properties, this.properties);

    if (options.defaultProperties) {
      this.loadLayout(options.defaultProperties);
    }

    this.init();
  }

   init() {

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
    this.properties.addEventListener("change", (e) => this._onChange(e));

    this.refresh();
  }

  refresh() {
    this.initTableCells()
    this.element.style.left = `${this.properties.x}px`;
    this.element.style.top = `${this.properties.y}px`;
    
    this.element.style.width = `${this.properties.width}px`;
    this.element.style.height = `${this.properties.height}px`;
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

  initTableCells() {
    
    this.element.innerHTML = "";

    const headersRow: HTMLTableRowElement = document.createElement("tr");
    const headers: Array<HTMLTableCellElement> = [];
    for (let h = 0; h < this.properties.columnsNumber; h++) {
      
      const header: HTMLTableCellElement = document.createElement("th")
      header.innerText = "Header";
      header.style.border = "1px solid black"

      headers.push(header);
      
    }
    headersRow.append(...headers);

    const rows: Array<HTMLTableRowElement> = [];
    for (let r = 0; r < this.properties.rowsNumber; r++) {
      const dataRow: HTMLTableRowElement = document.createElement("tr");
      
      const dataElements: Array<HTMLTableCellElement> = [];
      for (let h = 0; h < this.properties.columnsNumber; h++) {
        const data: HTMLTableCellElement = document.createElement("td")
        data.innerText = "Data";
        data.style.border = "1px solid black"
        
        dataElements.push(data);
      }
      dataRow.append(...dataElements);
      rows.push(dataRow)
    }
     

    this.element.append(headersRow, ...rows);
  }


  loadLayout(layout: Partial<LayoutReportTableItem>) {
    this.properties.beginUpdate();
    this.properties.x = layout.x ?? 0;
    this.properties.y = layout.y ?? 0;
    this.properties.width = layout.width ?? 0;
    this.properties.height = layout.height ?? 0;
    this.properties.name = layout.name ?? "";
    this.properties.color = layout.color;
    this.properties.backgroundColor = layout.backgroundColor;
    this.properties.textAlign = layout.textAlign as TextAlign;
    this.properties.borderWidth = layout.borderWidth;
    this.properties.borderStyle = layout.borderStyle;
    this.properties.borderColor = layout.borderColor;
    this.properties.fontFamily = layout.fontFamily;
    this.properties.fontSize = layout.fontSize;
    this.properties.fontWeight = layout.fontWeight;
    this.properties.endUpdate();

    this.refresh();
  }

  toJSON(): LayoutReportTableItem {
    return {
      x: this.properties.x,
      y: this.properties.y,
      width: this.properties.width,
      height: this.properties.height,
      name: this.properties.name,
      color: this.properties.color,
      backgroundColor: this.properties.backgroundColor,
      textAlign: this.properties.textAlign,
      borderWidth: this.properties.borderWidth,
      borderStyle: this.properties.borderStyle,
      borderColor: this.properties.borderColor,
      fontFamily: this.properties.fontFamily,
      fontSize: this.properties.fontSize,
      fontWeight: this.properties.fontWeight,
      type: this.element.tagName,
      columnHeight: this.properties.columnHeight,
      rowHeight: this.properties.rowHeight,
      rowsNumber: this.properties.rowsNumber,
      columnsNumber: this.properties.columnsNumber,
    };
  }

  private _onChange(args: ChangeEventArgs) {
    this._changeEventEmitter.emit(args);
  }
}
