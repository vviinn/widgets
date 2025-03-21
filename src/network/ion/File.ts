export const fileToB64 = async (f: File): Promise<string> =>
  new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      resolve(reader.result as string);
    });

    reader.readAsDataURL(f);
  });
