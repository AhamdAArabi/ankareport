import { IReportImageItem, IReportImageItem as LayoutReportImageItem } from "../../core/layout";
import { ChangeEventArgs } from "../../core/properties";
import ReportImageItemProperties from "../../core/reportImageItemProperties";
import ReportTableItemProperties from "../../core/reportTableItemProperties";
import StyleProperties from "../../core/styleProperties";
import styleProperties, { TextAlign } from "../../core/styleProperties";
import { MultipleStyles } from "../../core/utils/style.utils";
import ReportItemsFactory, { ReportItemsFactoryOptions } from "./base/reportItemsFactory";


export interface ReportLableItemOptions extends ReportItemsFactoryOptions {
  defaultProperties: Partial<LayoutReportImageItem>;
}

export default class ReportImageItem extends ReportItemsFactory {

  public properties: ReportImageItemProperties;
  private readonly _styles: MultipleStyles;
  private _uploadInput: HTMLInputElement = document.createElement("input");
  


  constructor(options: ReportItemsFactoryOptions) {
    super(options);
    this.properties = new ReportImageItemProperties(options.defaultProperties as IReportImageItem);
    this._styles = new MultipleStyles(...options.parentStyles, this.properties);

    if (options.defaultProperties) {
      this.loadLayout(options.defaultProperties);
    }

    this.init();
  }

   init() {
    if(this.element instanceof HTMLImageElement){
      if(this.properties.src == ""){
        this.element.src = "";
        this.handleOpenUploader();
      }else{
        this.element.src = this.properties.src;
      }
    }

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
  handleOpenUploader() {// Create a file input dynamically
    // this._uploadInput = document.createElement('input');
    this._uploadInput.type = 'file';
    this._uploadInput.id = 'dynamicUploadInput';
    // Set accepted file types (extensions)
    this._uploadInput.accept = 'image/*';

    // Append the input to the body (or any other element)
    document.body.appendChild(this._uploadInput);

    // Trigger the file input programmatically
    this._uploadInput.click();

    // Add event listener to the dynamically created file input
    this._uploadInput.addEventListener('change',(e:Event) => this.handleDynamicImageUpload(e, this._uploadInput, (result) => {
      // Handle the result as needed
      console.log('Uploaded data:', result);
      if(this.element instanceof HTMLImageElement){
        this.element.src = result;
        this.properties.src = result;
      }

      // Remove the dynamically created file input
      document.body.removeChild(this._uploadInput);
  }));

    
  }
  handleDynamicImageUpload(event: Event, uploadInput: HTMLInputElement, callback: (result: string) => void ) {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files && fileInput.files[0];

    if (file) {
        // Check if the file has an image extension
        const allowedExtensions: string[] = ['jpg', 'jpeg', 'png', 'gif'];
        const fileNameParts = file.name.split('.');
        const fileExtension = fileNameParts[fileNameParts.length - 1].toLowerCase();

        if (allowedExtensions.includes(fileExtension)) {
            // Create a FileReader to read the uploaded image
            const reader = new FileReader();

            reader.onload = (e: ProgressEvent<FileReader>) => {
              const result = e.target?.result as string;
              callback(result);
          };

            // Read the uploaded image as a data URL
            reader.readAsDataURL(file);
        } else {
            alert('Invalid file type. Please select an image.');
            // Remove the dynamically created file input
            document.body.removeChild(uploadInput);
        }
    }
  }
 
  refresh() {
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


  loadLayout(layout: Partial<LayoutReportImageItem>) {
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
    this.properties.src = layout.src ?? "";
    this.properties.endUpdate();

    this.refresh();
  }

  toJSON(): LayoutReportImageItem {
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
      src: this.properties.src,
    };
  }

  private _onChange(args: ChangeEventArgs) {
    this._changeEventEmitter.emit(args);
  }
}
