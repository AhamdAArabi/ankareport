import IDisposable from "../../../core/disposable";
import EventEmitter, { EventCallback } from "../../../core/eventEmitter";
import { IReportItemsFactory as LayoutReportItem } from "../../../core/layout";
import { PropertyChangeEventArgs } from "../../../core/properties";
import ReportItemProperties from "../../../core/reportItemProperties";
import StyleProperties, { TextAlign } from "../../../core/styleProperties";
import { MultipleStyles } from "../../../core/utils/style.utils";

export enum ItemsTypes {
  Label="LABEL",
  table="TABLE",
  image="IMAGE"
}
export interface ChangeEventArgs {
  changes: PropertyChangeEventArgs[];
}

export interface ReportItemsFactoryEventMap {
  change: ChangeEventArgs;
  focus: unknown;
}

export interface ReportItemsFactoryOptions {
  parentStyles: StyleProperties[];
  defaultProperties: Partial<LayoutReportItem>;
  appendTo?: HTMLElement;
}

export default abstract class ReportItemsFactory implements IDisposable {
  public readonly element: HTMLElement;

  public readonly properties = new ReportItemProperties();

  protected readonly _changeEventEmitter = new EventEmitter<ChangeEventArgs>();

  abstract refresh():void;
  abstract loadLayout(layout: Partial<LayoutReportItem>):void;
  abstract toJSON(): LayoutReportItem;
  abstract init():void;

  constructor(options: ReportItemsFactoryOptions) {

    const type: string | undefined = options?.defaultProperties.type;
    const elementTagName = type as string;
    this.element = document.createElement(elementTagName);
    
    if (options.appendTo) {
      options.appendTo.appendChild(this.element);
    }
  }




  addEventListener<K extends keyof ReportItemsFactoryEventMap>(
    event: K,
    listener: EventCallback<ReportItemsFactoryEventMap[K]>,
  ) {
    switch (event) {
      case "change":
        const callbackOnChange = listener as EventCallback<
          ReportItemsFactoryEventMap["change"]
        >;
        this._changeEventEmitter.add(callbackOnChange);
        break;
      case "focus":
        const callbackOnFocus = listener as EventCallback<
          ReportItemsFactoryEventMap["focus"]
        >;
        this.element.addEventListener("focus", () =>
          callbackOnFocus(undefined),
        );
        break;
    }
  }

  dispose() {
    this.element.remove();
  }

}
