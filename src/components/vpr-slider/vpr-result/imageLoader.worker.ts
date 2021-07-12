export const fetchInBackground = async (url: string): Promise<any> =>
  new Promise(async (resolve) => {
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      resolve(reader.result);
    });

    const response = await fetch(url);

    if (!response.ok) {
      resolve("");
    }

    const blob = await response.blob();

    reader.readAsDataURL(blob);
  });
