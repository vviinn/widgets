import { Resource } from "i18next";

export const resources: Resource = {
  "de-DE": {
    translation: {
      exampleImagesTitle:
        "Mit den Beispielbildern die Suche direkt ausprobieren",
      imageUploadButtonText: "Kamera oder Bild auswählen",
      privacyBadgeText:
        "Durch das Hochladen eines Bildes willigst Du in die Verarbeitung durch unseren Partner Vviinn ein. Das Bild wird nach einer Stunde Inaktivität gelöscht.",
      teaserText_1: "Finde Produkte auf",
      teaserText_2: "einem Foto",
      imageSearchModalTitle: "Bildsuche",
      onboardingBlock: {
        onboardingTitleText: "So funktioniert es",
        onboardingCard1: {
          title: "Starte die Bildsuche",
          text: "Lade ein Bild aus Deiner Galerie hoch oder fotografiere ein Produkt mit Deiner Kamera.",
        },
        onboardingCard2: {
          title: "Verfeiner Deine Suche",
          text: "Du kannst den Bildrahmen selber festlegen und so die Produkte genau auswählen.",
        },
        onboardingCard3: {
          title: "Ohne Hintergrund",
          text: "Die besten Ergebnisse erhältst Du, wenn das gesuchte Objekt mit einfarbigem und hellem Hintergrund zu sehen ist.",
        },
      },
      emptyResultsBlock: {
        title: "Leider nichts gefunden",
        text: "Leider konnten wir keine passenden Produkte finden. Bitte versuche es mit einem anderen Bildausschnitt noch einmal.",
      },
    },
  },
  en: {
    translation: {
      exampleImagesTitle: "Try out the search with the example images",
      imageUploadButtonText: "Upload a Photo",
      privacyBadgeText:
        "By uploading a picture you agree to the processing by our partner Vviinn. The image will be deleted after one hour of inactivity.",
      teaserText_1: "Find Product by Photo",
      teaserText_2: "",
      imageSearchModalTitle: "Visual Search",
      onboardingBlock: {
        onboardingTitleText: "This is how it works",
        onboardingCard1: {
          title: "Start the Visual Search",
          text: "Upload a picture from your gallery or take a picture of a product with your camera.",
        },
        onboardingCard2: {
          title: "Refine Your Search",
          text: "You can set the frame yourself, so you can choose exactly what you want.",
        },
        onboardingCard3: {
          title: "Without Background",
          text: "For best results, display the object you are looking for against a monochrome, light background.",
        },
      },
      emptyResultsBlock: {
        title: "Sorry, nothing was found",
        text: "Sorry, we could not find any matching products. Please try again by selecting a different area of the image.",
      },
    },
  },
};
