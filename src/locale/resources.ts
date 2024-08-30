import { Resource } from "i18next";

const VVIINN_LINK =
  "<a href='https://www.vviinn.com/' target='_blank'>Vviinn</a>";

export const resources: Resource = {
  de: {
    translation: {
      noResultText: "Keine Ergebnisse! Versuche es bitte später erneut.",
      basketButtonText: "In den Warenkorb",
      setMode: {
        widgetTitle: "Kaufen Sie ein Set und erhalten Sie Rabatt",
        widgetSubtitle:
          "Sparen Sie bis zu 15% beim Kauf von Produkten aus der Liste",
        basketButtonText: "Als Set kaufen",
        appliedDiscountText: "gespart",
        updateButtonText: "Neues Set vorschlagen",
      },

      exampleImagesTitle:
        "Mit den Beispielbildern die Suche direkt ausprobieren",
      imageUploadButtonText: "Bild hochladen",
      cameraButtonTextStart: "Kamera starten",
      cameraButtonTextStop: "Kamera stoppen",
      privacyBadgeText: `Durch das Hochladen eines Bildes willigst Du in die Verarbeitung durch unseren Partner ${VVIINN_LINK} ein. Das Bild wird nach einer Stunde Inaktivität gelöscht.`,
      teaserText: "Finde Produkte auf \n einem Foto",
      imageSearchModalTitle: "AI Search",
      textSearchPlaceholder: "mit Text suchen",
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
      filters: {
        modal: {
          title: "Filter",
          apply: "Anwenden",
          resetFilters: "Filter zurücksetzen",
        },
      },
      energyLabel: {
        dataSheetText: "Dokumentation",
      },
    },
  },
  en: {
    translation: {
      noResultText: "No results! Please, try again later.",
      basketButtonText: "Add to Basket",
      setMode: {
        widgetTitle: "Buy a set to get discount",
        widgetSubtitle: "Save up to 15% for buying products from the list",
        basketButtonText: "Buy as set",
        appliedDiscountText: "saved",
        updateButtonText: "Suggest New Set",
      },

      exampleImagesTitle: "Try out the search with the example images",
      imageUploadButtonText: "Upload Photo",
      cameraButtonTextStart: "Start Camera",
      cameraButtonTextStop: "Stop Camera",
      privacyBadgeText: `By uploading a picture you agree to the processing by our partner ${VVIINN_LINK}. The image will be deleted after one hour of inactivity.`,
      teaserText: "Find Product by Photo",
      imageSearchModalTitle: "AI Search",
      textSearchPlaceholder: "Search by text",
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
      filters: {
        modal: {
          title: "Filters",
          apply: "Apply",
          resetFilters: "Reset Filters",
        },
      },
      energyLabel: {
        dataSheetText: "Documentation",
      },
    },
  },
};
