export type AdsType = "adsGram" | "openAd" | "tonai" | "outLink";

export interface EntryParams  {
  debug?:boolean
  fixedType:AdsType
}
export interface InstanceAdsType {
  show?: (cb) => any | Promise<any>;
  click?: (cb) => any | Promise<any>;
}
export declare interface CallbackFunc {
  /**
      Indicates loading advertising resources from the platform. If the publisher's slot/area does not have any resources to load, false will be returned
    */
  adResourceLoad?: (e: boolean) => void;
  /**
     Indicates that the interactive advertisement is currently open
    */
  adOpening?: (e: boolean) => void;
  /**
     Indicates that the interactive advertisement has been opened
    */
  adOpened?: (e: boolean) => void;
  /**
     Indicates completion of interactive advertising task, which is defined by the traffic owner
    */
  adTaskFinished?: (e: boolean) => void;
  /**
     Indicates that interactive advertising is being closed
    */
  adClosing?: (e: boolean) => void;
  /**
     Indicates that interactive advertising has been turned off
    */
  adClosed?: (e: "viewAD" | "click") => void;
  /**
     Indicates that it has been clicked and redirected
    */
  adClick?: (e: boolean) => void;
}
