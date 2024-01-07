import Report from "../report/report";
import { ChangeEventArgs as ReportChangeEventArgs } from "../report/report.events";
import ReportItemsFactory from "../reportItemsFactory/base/reportItemsFactory";
import ReportSection from "../reportSection/reportSection";

export type SelectEventArgs =
  | SelectReportEventArgs
  | SelectReportSectionEventArgs
  | SelectReportItemEventArgs;

export interface SelectReportEventArgs {
  type: "Report";
  element: Report;
}

export interface SelectReportSectionEventArgs {
  type: "ReportSection";
  element: ReportSection;
}

export interface SelectReportItemEventArgs {
  type: "ReportItem";
  element: ReportItemsFactory;
}

export interface ReportContainerEventMap {
  change: ReportChangeEventArgs;
  select: SelectEventArgs;
}
