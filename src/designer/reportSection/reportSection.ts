import ContextMenu from "../../components/contextMenu/contextMenu";
import EventEmitter, { EventCallback } from "../../core/eventEmitter";
import { ISection } from "../../core/layout";
import StyleProperties, { TextAlign } from "../../core/styleProperties";
import { DataSourceTreeItemData } from "../components/dataSourceTreeList";
import Resizer, { ResizerOrientation } from "../components/resizer";
import Designer from "../designer";
import DesignerReportItem from "../reportItem/designerReportItem";
import ReportItemSelector from "../reportItem/reportItemSelector";
import ReportSectionProperties from "./reportSectionProperties";
import "./reportSection.css";
import { JoinStyles } from "../../core/utils/style.utils";

export interface ReportSectionOptions {
  title: string;
  binding?: string;
  designer: Designer;
  parent?: ReportSection;
  defaultStylesList: StyleProperties[];
}

export default class ReportSection {
  public readonly element = document.createElement("div");
  public readonly elementHeader = document.createElement("div");
  public readonly elementContent = document.createElement("div");
  public readonly reportItemSelector = new ReportItemSelector(this);
  public readonly resizer = new Resizer({
    orientation: ResizerOrientation.Horizontal,
    onResize: (e) => {
      this.properties.height = this.properties.height + e.offsetY;
    },
  });
  public subsections: ReportSection[] = [];
  public items: DesignerReportItem[] = [];

  public readonly properties = new ReportSectionProperties();
  public readonly joinStyls = new JoinStyles();

  private readonly _selectEventEmitter = new EventEmitter<SelectEventArgs>();
  private readonly _designer: Designer;
  public readonly parent: ReportSection | undefined;

  constructor(options: ReportSectionOptions) {
    this.properties.binding = options.binding || "";
    this.properties.title = options.title;
    this._designer = options.designer;
    this.parent = options.parent;

    options.defaultStylesList.forEach((x) => this.joinStyls.join(x));
    this.joinStyls.join(this.properties);

    this._init();
  }

  private _init() {
    this.element.classList.add("anka-report-section");
    this.elementHeader.classList.add("anka-report-section__header");
    this.elementContent.classList.add("anka-report-section__content");

    this.element.tabIndex = 0;

    this.element.appendChild(this.elementHeader);
    this.element.appendChild(this.elementContent);
    this.elementContent.appendChild(this.reportItemSelector.element);
    this.elementContent.appendChild(this.resizer.element);
    this.refresh();

    this.element.addEventListener("focus", () => {
      this._selectEventEmitter.emit({
        type: "ReportSection",
        element: this,
      });
    });
    this.properties.addEventListener("change", () => {
      this.refresh();
    });
    this.elementContent.ondragover = (e) => e.preventDefault();
    this.elementContent.ondrop = (e) => this.onContentDrop(e);

    this.element.addEventListener("contextmenu", (e) => {
      if (!this.properties.binding) return;

      if (e.target !== this.elementContent && e.target !== this.elementHeader) {
        return;
      }

      const dataSource = this._designer.getDataSource();
      const bindings = getReportSectionBindings(this);

      let sectionDataSource = dataSource;

      for (let i = bindings.length - 1; i >= 0; i--) {
        const field = bindings[i];

        const dataSourceItem = sectionDataSource.find((x) => x.field === field);

        // TODO: Possible null value here
        sectionDataSource = dataSourceItem?.children!;
      }

      const subsectionDataList = getSubsectionDataList(
        sectionDataSource,
        this.subsections,
      );

      if (subsectionDataList.length === 0) return;

      e.preventDefault();

      new ContextMenu({
        width: "150px",
        buttons: [
          ...subsectionDataList.map((x) => ({
            key: "add-section",
            label: `Add Section (${x.label})`,
            data: x,
          })),
        ],
        top: e.clientY,
        left: e.clientX,
        onClick: (e) => {
          switch (e.key) {
            case "add-section":
              const data = e.data as DataSourceTreeItemData;

              const subsection = this.addSection();
              subsection.properties.binding = data.field;

              break;
          }
        },
      });
    });

    this.reportItemSelector.addEventListener("contextmenu", (e) => {
      e.buttons = [{ key: "remove", label: "Remove" }];

      e.onClick = (args) => {
        if (args.key === "remove") {
          this.removeSelectedItem();
        }
      };
    });
  }

  refresh() {
    this.elementHeader.innerText = this._getHeaderText();
    this.elementContent.style.height = `${this.properties.height}px`;
  }

  private _getHeaderText() {
    let title = this.properties.title;

    if (this.properties.binding) {
      title += ` (${this.properties.binding})`;
    }

    return title;
  }

  private onContentDrop(e: DragEvent) {
    e.preventDefault();

    const text = e.dataTransfer?.getData("label");

    const item = this.addItem();
    item.properties.text = text || "Label";
    item.properties.binding = e.dataTransfer?.getData("field") || "";
    item.properties.x = e.offsetX;
    item.properties.y = e.offsetY;
    item.properties.width = 100;
    item.properties.height = 20;

    this.selectItem(item);
  }

  addEventListener<K extends keyof ReportSectionEventMap>(
    event: K,
    listener: EventCallback<ReportSectionEventMap[K]>,
  ) {
    switch (event) {
      case "select":
        this._selectEventEmitter.add(listener);
        break;
    }
  }

  addItem() {
    const item = new DesignerReportItem({
      defaultStylesList: this.joinStyls.getList(),
    });
    item.addEventListener("select", () => this.selectItem(item));
    this.items.push(item);

    this.elementContent.insertBefore(
      item.element,
      this.reportItemSelector.element,
    );

    return item;
  }

  addSection() {
    const section = new ReportSection({
      title: "Content",
      binding: "",
      designer: this._designer,
      parent: this,
      defaultStylesList: this.joinStyls.getList(),
    });

    section.addEventListener("select", (e) => {
      this._selectEventEmitter.emit(e);
    });

    this.subsections.push(section);

    this.element.appendChild(section.element);

    return section;
  }

  selectItem(item: DesignerReportItem) {
    this.deselectAll();

    this.reportItemSelector.show(item);

    this._selectEventEmitter.emit({
      type: "ReportItem",
      element: item,
    });
  }

  removeItem(item: DesignerReportItem) {
    const index = this.items.findIndex((x) => x === item);
    this.items.splice(index, 1);
    item.dispose();
  }

  removeSelectedItem() {
    const item = this.reportItemSelector.attachedTo;

    if (item) {
      this.reportItemSelector.hide();
      this.removeItem(item);
    }
  }

  deselectAll() {
    this.reportItemSelector.hide();

    this.subsections.forEach((x) => x.deselectAll());
  }

  loadLayout(layout: ISection) {
    this.properties.height = layout.height;
    this.properties.binding = layout.binding;

    layout.items?.forEach((data) => {
      const item = this.addItem();
      item.loadLayout(data);
    });

    layout.sections?.forEach((data) => {
      const section = this.addSection();
      section.loadLayout(data);
    });

    this.properties.color = layout.color;
    this.properties.backgroundColor = layout.backgroundColor;
    this.properties.textAlign = layout.textAlign as TextAlign;
    this.properties.border = layout.border;
    this.properties.fontFamily = layout.fontFamily;
    this.properties.fontSize = layout.fontSize;
    this.properties.fontWeight = layout.fontWeight;

    this.refresh();
  }

  toJSON(): ISection {
    return {
      height: this.properties.height,
      binding: this.properties.binding,
      items: this.items.map((x) => x.toJSON()),
      sections: this.subsections.map((x) => x.toJSON()),
      color: this.properties.color,
      backgroundColor: this.properties.backgroundColor,
      textAlign: this.properties.textAlign,
      border: this.properties.border,
      fontFamily: this.properties.fontFamily,
      fontSize: this.properties.fontSize,
      fontWeight: this.properties.fontWeight,
    };
  }
}

export type SelectEventArgs =
  | SelectReportSectionEventArgs
  | SelectReportItemEventArgs;

export interface SelectReportSectionEventArgs {
  type: "ReportSection";
  element: ReportSection;
}

export interface SelectReportItemEventArgs {
  type: "ReportItem";
  element: DesignerReportItem;
}

export interface ReportSectionEventMap {
  select: SelectEventArgs;
}

function getSubsectionDataList(
  items: DataSourceTreeItemData[] | undefined,
  sections: ReportSection[],
) {
  if (!items) return [];

  const subsectionDataList = items.filter(
    (x) => x.children && x.children.length > 0,
  );

  const existingFields = sections.map((x) => x.properties.binding);

  return subsectionDataList.filter((x) => !existingFields.includes(x.field));
}

function getReportSectionBindings(section: ReportSection): string[] {
  const result = [];

  let iterator: ReportSection | undefined = section;

  while (iterator) {
    result.push(iterator.properties.binding);

    iterator = iterator.parent;
  }

  return result;
}
