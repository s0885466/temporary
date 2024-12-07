export const loadRemoteEntryScript = async (url: string) => {
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");

    script.src = url;
    script.type = "text/javascript";
    script.async = true;

    script.onload = () => {
      resolve();
    };

    script.onerror = () => {
      reject(new Error(`Could not load remote entry: ${url}`));
    };

    document.head.appendChild(script);
  });
};
