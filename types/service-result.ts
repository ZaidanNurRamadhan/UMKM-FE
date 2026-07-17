export type ServiceResult<T> =
  | {
      success: true;
      data: T;
      message: string;
    }
  | {
      success: false;
      data: null;
      message: string;
      code?: string;
      details?: string;
    };
