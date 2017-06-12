declare interface ITtDemoStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  ListNameFieldLabel: string;
  ListNameFieldLabelDescription: string;
}

declare module 'ttDemoStrings' {
  const strings: ITtDemoStrings;
  export = strings;
}
