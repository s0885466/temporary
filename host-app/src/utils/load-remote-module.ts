import { loadRemoteEntryScript } from "./load-remote-entry-script";

type LoadRemoteModule = <T>(
  url: string,
  scope: string,
  module: string,
) => Promise<T>;

export const loadRemoteModule: LoadRemoteModule = async function (
  url,
  scope,
  module,
) {
  // Загружаем удалённый скрипт

  try {
    await loadRemoteEntryScript(url);
  } catch (err) {
    throw new Error((err as Error)?.message);
  }

  // @ts-ignore
  await __webpack_init_sharing__("default");

  const container = (window as any)[scope];

  if (!container) {
    throw new Error(`Container ${scope} not found at ${url}`);
  }
  // @ts-ignore
  await container.init(__webpack_share_scopes__.default);

  const factory = await container.get(module);

  return factory();
};
