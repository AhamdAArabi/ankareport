import { PropertyChangeEventArgs } from "../../core/properties";
import ReportItemsFactory from "../reportItemsFactory/base/reportItemsFactory";
import ReportSection from "./reportSection";

export type SelectEventArgs =
  | SelectReportSectionEventArgs
  | SelectReportItemEventArgs;

export interface SelectReportSectionEventArgs {
  type: "ReportSection";
  element: ReportSection;
}

export interface SelectReportItemEventArgs {
  type: "ReportItem";
  element: ReportItemsFactory;
}

export type ChangeEventArgs =
  | SectionAddEventArgs
  | SectionChangeEventArgs
  | SectionRemoveEventArgs
  | ItemAddEventArgs
  | ItemChangeEventArgs
  | ItemRemoveEventArgs;

export interface SectionAddEventArgs {
  type: "add-section";
  section: ReportSection;
}

export interface SectionChangeEventArgs {
  type: "change-section";
  section: ReportSection;
  changes: PropertyChangeEventArgs[];
}

export interface SectionRemoveEventArgs {
  type: "remove-section";
  section: ReportSection;
}

export interface ItemAddEventArgs {
  type: "add-item";
  item: ReportItemsFactory;
}

export interface ItemChangeEventArgs {
  type: "change-item";
  item: ReportItemsFactory;
  changes: PropertyChangeEventArgs[];
}

export interface ItemRemoveEventArgs {
  type: "remove-item";
  item: ReportItemsFactory;
}

export interface ReportSectionEventMap {
  select: SelectEventArgs;
  change: ChangeEventArgs;
}
