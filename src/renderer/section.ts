import { IReportImageItem, IReportItemsFactory, IReportLableItem, IReportTableItem, ISection, IStyle } from "../core/layout";
import StyleProperties, { TextAlign } from "../core/styleProperties";
import ReportItemsFactory, { ItemsTypes } from "../designer/reportItemsFactory/base/reportItemsFactory";
import ReportImageItem from "../designer/reportItemsFactory/reportImageItem";
import ReportLableItem from "../designer/reportItemsFactory/reportLableItem";
import ReportTableItem from "../designer/reportItemsFactory/reportTableItem";

export default class Section {
  public readonly element = document.createElement("div");
  public readonly elementSections = document.createElement("div");
  private readonly reportItems: ReportItemsFactory[] = [];

  constructor(
    private readonly layout: ISection,
    private readonly data: any,
    private readonly defaultStyles: IStyle[],
  ) {
    this._init();
  }

  private _init() {
    this.element.classList.add("anka-section");

    this.element.style.height = this.layout.height + "px";
    this.element.style.position = "relative";

    const defaultStylesList: StyleProperties[] = [];
    this.defaultStyles.forEach((x) =>
      defaultStylesList.push(new StyleProperties(x)),
    );
    defaultStylesList.push(new StyleProperties(this.layout));

    this.layout.items?.forEach((layout) => {
      const item: ReportItemsFactory = this.itemCreation(layout, defaultStylesList);

      item.properties.x = layout.x;
      item.properties.y = layout.y;
      item.properties.width = layout.width;
      item.properties.height = layout.height;
      item.properties.color = layout.color;
      item.properties.backgroundColor = layout.backgroundColor;
      item.properties.borderWidth = layout.borderWidth;
      item.properties.borderStyle = layout.borderStyle;
      item.properties.borderColor = layout.borderColor;
      item.properties.fontFamily = layout.fontFamily;
      item.properties.fontSize = layout.fontSize;
      item.properties.fontWeight = layout.fontWeight;
      item.properties.textAlign = layout.textAlign as TextAlign;

      if (layout.binding) {
        item.properties.text = this.data ? this.data[layout.binding] : "NULL";
      } else {
        item.properties.text = layout.text;
      }

      item.refresh();
      this.element.appendChild(item.element);

      this.reportItems.push(item);
    });

    this.layout.sections?.forEach((sectionLayout) => {
      const subDataSource = this.data ? this.data[sectionLayout.binding] : {};

      subDataSource?.forEach((sectionDataSource: any) => {
        const section = new Section(sectionLayout, sectionDataSource, [
          ...this.defaultStyles,
          this.layout,
        ]);

        this.elementSections.appendChild(section.element);
        this.elementSections.appendChild(section.elementSections);
      });
    });
  }
  itemCreation( layout:IReportItemsFactory, styles: StyleProperties[]): ReportItemsFactory {
    let item: ReportItemsFactory;
    let defaultProperties:
      | IReportItemsFactory
      | IReportLableItem
      | IReportTableItem
      | IReportImageItem;

    switch (layout.type) {
      case ItemsTypes.Label:
        defaultProperties = {
          x: layout.x!,
          y: layout.y!,
          width: 100,
          height: 20,
          name: "",
          type: "div",
          text: "label",
        };
        item = new ReportLableItem({
          parentStyles: styles,
          defaultProperties
        });

        break;
      case ItemsTypes.table:
        defaultProperties = {
          x: layout?.x!,
          y: layout?.y!,
          width: 100,
          height: 50,
          name: "",
          type: "table",
          columnsNumber: 1,
          rowsNumber: 1,
        };
        item = new ReportTableItem({
          parentStyles: styles,
          defaultProperties
        });

        break;
      case ItemsTypes.image:
        defaultProperties = {
          x: layout?.x!,
          y: layout?.y!,
          width: 100,
          height: 50,
          name: "",
          type: "img",
          src: (layout as IReportImageItem)?.src!
        };
        item = new ReportImageItem({
          parentStyles:  styles,
          defaultProperties
        });

        break;

      default:
        item = new ReportLableItem({
          parentStyles:  styles,
          defaultProperties: { ...layout, type: "div" }
        });
        break;
    }
    return item;
  }
}
