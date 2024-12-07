import React, { useEffect, useState, ComponentType, useCallback } from "react";
import { loadRemoteModule } from "../utils/load-remote-module";
import Error from "./error";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type RemoteLoaderProps<T extends object> = {
  remoteUrl: string;
  scope: string;
  moduleName: string;
  props?: T;
};
export const RemoteLoader = <T extends object>({
  remoteUrl,
  scope,
  moduleName,
  props,
}: RemoteLoaderProps<T>) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<null | string>("");
  const [Component, setComponent] = useState<ComponentType<T> | null>(null);

  const loadHandler = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);

      await delay(1000);

      const module = await loadRemoteModule<{ default: ComponentType<T> }>(
        remoteUrl,
        scope,
        moduleName,
      );

      setComponent(() => module.default);
    } catch (err) {
      setError((err as Error)?.message || "Error loading remote module");
    } finally {
      setIsLoading(false);
    }
  }, [remoteUrl, scope, moduleName]);

  useEffect(() => {
    loadHandler();
  }, [loadHandler]);

  return (
    <div>
      <h1>This is micro frontend loader</h1>
      {isLoading && <div>Loading...</div>}
      {error && <Error message={error} refetch={loadHandler} />}
      {Component && <Component {...(props as T)} />}
    </div>
  );
};
