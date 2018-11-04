declare module '@google-cloud/logging' {
  interface LogConfig {
    removeCircular: boolean;
  }

  class Entry {
    metadata: object;
    data: object;
    constructor(metadata: object | null | undefined, data: object | string);
    constructor(data: object | string);
    toJSON(options?: LogConfig): {};
  }

  interface WriteOptions {
    gaxOptions: object;
    labels: object[];
    resource: object;
  }

  type LogWriteCallback = (err: Error | null, apiResponse: object) => void;
  type DeleteLogCallback = (err: Error | null, apiResponse: object) => void;

  type LogWriteResponse = object[];
  type DeleteLogResponse = object[];

  type EntryArg = Entry | Entry[];

  class Log {
    constructor(logging: Logging, name: string, options: LogConfig);
    entry(
      resource: object | string | null | undefined,
      data: object | string
    ): Entry;
    alert(
      entry: EntryArg,
      options?: WriteOptions,
      callback?: LogWriteCallback
    ): Promise<LogWriteResponse>;
    critical(
      entry: EntryArg,
      options?: WriteOptions,
      callback?: LogWriteCallback
    ): Promise<LogWriteResponse>;
    debug(
      entry: EntryArg,
      options?: WriteOptions,
      callback?: LogWriteCallback
    ): Promise<LogWriteResponse>;
    emergency(
      entry: EntryArg,
      options?: WriteOptions,
      callback?: LogWriteCallback
    ): Promise<LogWriteResponse>;
    info(
      entry: EntryArg,
      options?: WriteOptions,
      callback?: LogWriteCallback
    ): Promise<LogWriteResponse>;
    notice(
      entry: EntryArg,
      options?: WriteOptions,
      callback?: LogWriteCallback
    ): Promise<LogWriteResponse>;
    warning(
      entry: EntryArg,
      options?: WriteOptions,
      callback?: LogWriteCallback
    ): Promise<LogWriteResponse>;
    error(
      entry: EntryArg,
      options?: WriteOptions,
      callback?: LogWriteCallback
    ): Promise<LogWriteResponse>;
    write(
      entry: EntryArg,
      options?: WriteOptions,
      callback?: LogWriteCallback
    ): Promise<LogWriteResponse>;
    delete(gaxOptions: object): Promise<DeleteLogResponse>;
    delete(
      gaxOptions: object,
      callback?: DeleteLogCallback
    ): Promise<DeleteLogResponse>;
    delete(callback?: DeleteLogCallback): Promise<DeleteLogResponse>;
  }

  interface ClientConfig {
    projectId?: string;
    keyFiulename?: string;
    email?: string;
    credentials?: {
      client_email: string;
      private_key: string;
    };
    autoRetry?: boolean;
    maxRetries?: number;
    promise?: Function;
  }

  class Logging {
    constructor(options: ClientConfig);
    log(name: string, options?: LogConfig): Log;
    entry(
      resource: object | string | null | undefined,
      data: object | string
    ): Entry;
  }

  export { Logging, Log, Entry };
}
