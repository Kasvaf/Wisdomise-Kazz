declare module "react-notifications" {
  type NotificationTriggerFn = (
    message: string,
    title?: string,
    timeout?: number,
    callback?: () => unknown,
    priority?: boolean
  ) => void;

  export interface INotificationManager {
    warning: NotificationTriggerFn;
    success: NotificationTriggerFn;
    error: NotificationTriggerFn;
    info: NotificationTriggerFn;
  }

  export const NotificationManager: INotificationManager;
  export const NotificationContainer;
}
