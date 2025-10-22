import { Resource } from "i18next";

const VVIINN_LINK =
  "<a href='https://www.vviinn.com/' target='_blank' rel='noopener noreferrer'>vviinn</a>";

export const resources: Resource = {
  de: {
    translation: {
      noResultText: "Keine Ergebnisse! Versuche es bitte später erneut.",
      basketButtonText: "In den Warenkorb",
      basketButtonPressedText: "In den Warenkorb",
      discoveryWidgetTitle: "Ähnliche Produkte",
      contentLabel: "Inhalt",
      listLabel: "Kategorie",
      setMode: {
        widgetTitle: "Kaufen Sie ein Set und erhalten Sie Rabatt",
        widgetSubtitle:
          "Sparen Sie bis zu 15% beim Kauf von Produkten aus der Liste",
        basketButtonText: "Als Set kaufen",
        basketButtonPressedText: "gespart",
        updateButtonText: "Neues Set vorschlagen",
      },

      exampleImagesTitle:
        "Mit den Beispielbildern die Suche direkt ausprobieren",
      imageUploadButtonText: "Bild hochladen",
      cameraButtonTextStart: "Kamera starten",
      cameraButtonTextStop: "Kamera stoppen",
      privacyBadgeText: `Durch das Hochladen eines Bildes willigst Du in die Verarbeitung durch unseren Partner ${VVIINN_LINK} ein. Das Bild wird nach einer Stunde Inaktivität gelöscht.`,
      teaserText: "Finde Dein Produkt",
      imageSearchModalTitle: "KI-Suche",
      textSearchPlaceholder: "mit Text suchen",
      suggestions: {
        title: "KI-Vorschläge",
        description:
          "Hier sind einige Vorschläge, die Ihnen helfen, das perfekte zu finden.",
      },
      speechRecognition: {
        placeholder: "Aufnahme...",
        tooltip: {
          general: "Bitte Mikrofon aktivieren",
          siri: "Bitte aktivieren Siri",
        },
      },
      buttons: {
        next: "weitere Produkte anzeigen",
        previous: "vorherige Produkte anzeigen",
      },
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
        text: "Bitte laden Sie eine .jpg, .png, .webp, .avif oder .heic Bilddatei hoch.",
        button: "Neues Bild hochladen",
      },
      heicNotSupportedBlock: {
        title: "HEIC wird nicht unterstützt",
        text: "HEIC-Dateien werden nur in Safari und auf iOS-Geräten unterstützt. Bitte verwenden Sie ein anderes Format.",
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
          noFiltersMessage:
            "Für die akuelle Suche sind keine Filter verfügbar.",
        },
        search: {
          placeholder: "Suche...",
        },
        imageFilterText: "Bild",
        cropFilterText: "Bildausschnitt",
      },
      energyLabel: {
        dataSheetText: "Produktdatenblatt",
        iconAlt: "Energieeffizienzklasse",
        iconAltWithClass:
          "Energieeffizienzklasse {{energyClass}} auf einer Skala von {{minClass}} bis {{maxClass}}",
        iconAltWithClassOnly: "Energieeffizienzklasse {{energyClass}}",
      },
      a11y: {
        // General UI
        closeButton: "Fenster schließen",
        backButton: "Zurück",

        // Search & Input
        speechButton: "Spracheingabe starten",
        textSearchButton: "Textsuche starten",
        cameraModeSearchButton: "KI-Suche mit Kamera starten",
        modalModeSearchButton: "KI-Suche starten",
        uploadModeSearchButton: "KI-Suche mit Bildupload starten",

        // Camera & Images
        cameraExampleImage: "Beispielbild für die Kamerafunktion",
        capturedImage: "Von der Kamera aufgenommenes Bild",
        zoomIn: "Vergrößern",
        zoomOut: "Verkleinern",
        takePicture: "Foto aufnehmen",
        cropperImage:
          "Hochgeladenes Bild zum Zuschneiden und für die visuelle Suche",
        uploadedImage: "Hochgeladenes Bild für die visuelle Suche",

        // Product Card
        addToFavorites: "Zu Favoriten hinzufügen",
        removeFromFavorites: "Von Favoriten entfernen",
        findSimilarProducts: "Ähnliche Produkte finden",

        // Filters
        productFilters: "Produktfilter",
        selectedFilters: "Ausgewählte Filter",
        openFilters: "Filter öffnen",
        closeDialog: "Dialog schließen",
        removeFilterLabel: "Filter entfernen: {{label}}",
        filterExpanded: "{{label}} Filter erweitert",
        filterSelectionCleared: "Filterauswahl gelöscht",
        filterDialogOpened: "Filter-Dialog geöffnet",
        filterDialogClosed: "Filter-Dialog geschlossen",
        filterRemoved: "Filter entfernt: {{label}}",
        filterOptions: "{{label}} Filteroptionen",
        filterButton: "{{label}} Filter",
        colorOption: "{{label}} Farbe",
        showMoreOptions: "{{count}} weitere {{label}} Optionen anzeigen",

        // Detected Objects
        detectedObject: "Erkanntes Objekt auswählen",

        // Discovery
        recommendations: "Empfohlene Produkte",
        sourceProductImage: "Bild des ursprünglichen Produkts",

        // Price Range
        priceRangeMin: "Mindestpreis",
        priceRangeMax: "Höchstpreis",

        // External Links
        vviinnLink: "Vviinn-Website besuchen (öffnet in neuem Tab)",
      },
    },
  },
  en: {
    translation: {
      noResultText: "No results! Please, try again later.",
      basketButtonText: "Add to Basket",
      basketButtonPressedText: "Add to Basket",
      discoveryWidgetTitle: "Recommended products",
      contentLabel: "Content",
      listLabel: "Category",
      setMode: {
        widgetTitle: "Buy a set to get discount",
        widgetSubtitle: "Save up to 15% for buying products from the list",
        basketButtonText: "Buy as set",
        basketButtonPressedText: "saved",
        updateButtonText: "Suggest New Set",
      },

      exampleImagesTitle: "Try out the search with the example images",
      imageUploadButtonText: "Upload Photo",
      cameraButtonTextStart: "Start Camera",
      cameraButtonTextStop: "Stop Camera",
      privacyBadgeText: `By uploading a picture you agree to the processing by our partner ${VVIINN_LINK}. The image will be deleted after one hour of inactivity.`,
      teaserText: "Find Your Product",
      imageSearchModalTitle: "AI Search",
      textSearchPlaceholder: "Search by text",
      suggestions: {
        title: "AI Suggestions",
        description:
          "Here are some suggestions to help you find the perfect match.",
      },
      speechRecognition: {
        placeholder: "Listening...",
        tooltip: {
          general: "Please enable microphone",
          siri: "Please enable Siri",
        },
      },
      buttons: {
        next: "show next products",
        previous: "show previous products",
      },
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
        text: "Please upload a .jpg, .png, .webp, .avif, or .heic image file.",
        button: "Upload another file",
      },
      heicNotSupportedBlock: {
        title: "HEIC not supported",
        text: "HEIC files are only supported in Safari and iOS browsers. Please use a different format.",
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
          noFiltersMessage: "No filters available for the current search.",
        },
        search: {
          placeholder: "Search...",
        },
        imageFilterText: "Image",
        cropFilterText: "Crop",
      },
      energyLabel: {
        dataSheetText: "Product Data Sheet",
        iconAlt: "Energy efficiency class",
        iconAltWithClass:
          "Energy efficiency class {{energyClass}} on a scale from {{minClass}} to {{maxClass}}",
        iconAltWithClassOnly: "Energy efficiency class {{energyClass}}",
      },
      a11y: {
        // General UI
        closeButton: "Close window",
        backButton: "Go back",

        // Search & Input
        speechButton: "Start speech input",
        textSearchButton: "Start text search",
        cameraModeSearchButton: "Start AI search with camera",
        modalModeSearchButton: "Start AI search",
        uploadModeSearchButton: "Start AI search with image upload",

        // Camera & Images
        cameraExampleImage: "Example image for the camera function",
        capturedImage: "Image captured by the camera",
        zoomIn: "Zoom in",
        zoomOut: "Zoom out",
        takePicture: "Take picture",
        cropperImage: "Uploaded image for cropping and visual search",
        uploadedImage: "Uploaded image for visual search",

        // Product Card
        addToFavorites: "Add to favorites",
        removeFromFavorites: "Remove from favorites",
        findSimilarProducts: "Find similar products",

        // Filters
        productFilters: "Product filters",
        selectedFilters: "Selected filters",
        openFilters: "Open filters",
        closeDialog: "Close dialog",
        removeFilterLabel: "Remove filter: {{label}}",
        filterExpanded: "{{label}} filter expanded",
        filterSelectionCleared: "Filter selection cleared",
        filterDialogOpened: "Filter dialog opened",
        filterDialogClosed: "Filter dialog closed",
        filterRemoved: "Filter removed: {{label}}",
        filterOptions: "{{label}} filter options",
        filterButton: "{{label}} filter",
        colorOption: "{{label}} color",
        showMoreOptions: "Show {{count}} more {{label}} options",

        // Detected Objects
        detectedObject: "Select detected object",

        // Discovery Widget
        recommendations: "Recommended products",
        sourceProductImage: "Source product image",

        // Price Range
        priceRangeMin: "Minimum price",
        priceRangeMax: "Maximum price",

        // External Links
        vviinnLink: "Visit Vviinn website (opens in new tab)",
      },
    },
  },
};
