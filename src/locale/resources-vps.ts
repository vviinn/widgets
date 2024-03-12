import { Resource } from "i18next";

export const resources: Resource = {
  de: {
    translation: {
      exampleImagesTitle:
        "Mit den Beispielbildern die Suche direkt ausprobieren",
      imageUploadButtonText: "Bild hochladen",
      cameraButtonTextStart: "Kamera starten",
      cameraButtonTextStop: "Kamera stoppen",
      privacyBadgeText:
        "Durch das Hochladen eines Bildes willigst Du in die Verarbeitung durch unseren Partner Vviinn ein. Das Bild wird nach einer Stunde Inaktivität gelöscht.",
      teaserText: "Finde Produkte auf \n einem Foto",
      imageSearchModalTitle: "Bildsuche",
      emptyResultsBlock: {
        title: "Leider nichts gefunden",
        button: "Neues Bild hochladen",
      },
      serverErrorBlock: {
        title: "Keine Verbindung",
        button: "Erneut versuchen",
      },
      wrongFormatBlock: {
        title: "Dateityp wird nicht unterstützt",
        text: "Bitte laden Sie eine .jpg, .png oder .webp Bilddatei hoch.",
        button: "Neues Bild hochladen",
      },
      wrongAspectRatioBlock: {
        title: "Das Bild ist zu schmal",
        button: "Neues Bild hochladen",
      },
    },
  },
  en: {
    translation: {
      exampleImagesTitle: "Try out the search with the example images",
      imageUploadButtonText: "Upload Photo",
      cameraButtonTextStart: "Start Camera",
      cameraButtonTextStop: "Stop Camera",
      privacyBadgeText:
        "By uploading a picture you agree to the processing by our partner Vviinn. The image will be deleted after one hour of inactivity.",
      teaserText: "Find Product by Photo",
      imageSearchModalTitle: "Visual Search",
      emptyResultsBlock: {
        title: "Sorry, nothing found",
        button: "Upload another image",
      },
      serverErrorBlock: {
        title: "Something went wrong",
        button: "Try again",
      },
      wrongFormatBlock: {
        title: "Wrong file format",
        text: "Please upload a .jpg, .png or .webp image file.",
        button: "Upload another file",
      },
      wrongAspectRatioBlock: {
        title: "The image is too narrow",
        button: "Upload another image",
      },
    },
  },
};
