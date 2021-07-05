import { Component, Host, h } from "@stencil/core";

@Component({
  tag: "vviinn-onboarding",
  styleUrl: "vviinn-onboarding.css",
  shadow: true,
})
export class VviinnOnboarding {
  render() {
    return (
      <Host>
        <h3>So funktioniert es</h3>
        <vviinn-slider>
          <vviinn-slide>
            <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" fill="none">
              <defs />
              <path fill="#393939" d="M74.55 20a5.06 5.06 0 014.14 2l4.72 9.32.1.18.11.17A5.07 5.07 0 0087.93 34h13.87c5.07 0 9.2 3.59 9.2 8v50c0 4.41-4.13 8-9.2 8H18.2c-5.07 0-9.2-3.59-9.2-8V42c0-4.41 4.13-8 9.2-8h13.87a5.072 5.072 0 004.31-2.34l.11-.17.1-.18L41.31 22a5.06 5.06 0 014.14-2h29.1zm0-4h-29.1a9 9 0 00-7.6 4L33 29.5a1.13 1.13 0 01-1 .5H18.2C10.91 30 5 35.37 5 42v50c0 6.63 5.91 12 13.2 12h83.6c7.29 0 13.2-5.37 13.2-12V42c0-6.63-5.91-12-13.2-12H87.93a1.13 1.13 0 01-1-.5L82.15 20a9 9 0 00-7.6-4z" />
              <path fill="#393939" d="M96 46a4 4 0 110 8 4 4 0 010-8zm0-4a8 8 0 100 16.001A8 8 0 0096 42z" />
              <path fill="#2F8EDF" d="M60 42a24 24 0 100 48.001A24 24 0 0060 42zm12 26H62v10a2 2 0 01-4 0V68H48a2 2 0 010-4h10V54a2 2 0 014 0v10h10a2 2 0 110 4z" />
            </svg>
            <div class="text">
              <h4>Starte die Bildsuche</h4>
              <p>
                Lade ein Bild aus Deiner Galerie hoch oder fotografiere ein Produkt mit deiner Kamera.
                </p>
            </div>
          </vviinn-slide>
          <vviinn-slide>
            <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" fill="none">
              <defs />
              <path fill="#393939" d="M110.35 96.52l-24.8-22.66a6.22 6.22 0 00-8.14-.27l-.09.07-10.57 8.93-18.33-17.88a6.001 6.001 0 00-8.51-.35L8.69 91.49a2 2 0 002.62 3l31.3-27.2a2 2 0 012.233-.359 2 2 0 01.637.479l.1.1 45 43.9a2.005 2.005 0 002.83-.03 2.003 2.003 0 00-.03-2.83L69.63 85.39l10.22-8.63a2.3 2.3 0 013 .07l24.77 22.65c.377.343.871.529 1.38.52a2 2 0 001.35-3.48zM75 31a10 10 0 110 20 10 10 0 010-20zm0-4a14 14 0 100 28 14 14 0 000-28z" />
              <path fill="#2F8EDF" d="M12 36H8V20A12 12 0 0120 8h16v4H20a8 8 0 00-8 8v16zM112 36h-4V20a8.001 8.001 0 00-8-8H84V8h16a11.998 11.998 0 0112 12v16zM36 112H20a11.998 11.998 0 01-12-12V84h4v16a8 8 0 008 8h16v4zM100 112H84v-4h16a8 8 0 008-8V84h4v16c0 3.183-1.264 6.235-3.515 8.485A11.996 11.996 0 01100 112z" />
            </svg>
            <div class="text">
              <h4>Verfeiner deine Suche</h4>
              <p>
                Du kannst den Bildrahmen selber festlegen und so die Produkte genau auswählen.
              </p>
            </div>
          </vviinn-slide>
          <vviinn-slide>
            <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" fill="none">
              <defs />
              <path fill="#2F8EDF" d="M84.09 43.24a.53.53 0 00-.29-.48L60.28 29.4a.522.522 0 00-.27-.07.531.531 0 00-.28.07L36.2 42.76a.54.54 0 000 1l23.53 13.3a.54.54 0 00.55 0L83.8 43.72a.53.53 0 00.29-.48zM57.28 61.23L33.73 47.88a.569.569 0 00-.85.48V75a.54.54 0 00.29.48L56.72 88.8a.56.56 0 00.56 0 .53.53 0 00.28-.48V61.71a.56.56 0 00-.28-.48zM86.84 47.88a.63.63 0 00-.29-.08.55.55 0 00-.28.08L62.73 61.23a.56.56 0 00-.28.48v26.61a.53.53 0 00.28.48.56.56 0 00.56 0l23.54-13.29a.54.54 0 00.29-.48V48.36a.55.55 0 00-.28-.48z" />
              <path fill="#2F8EDF" d="M100 7.94H20a12 12 0 00-12 12v80a11.998 11.998 0 0012 12h80c3.183 0 6.235-1.264 8.485-3.515A11.996 11.996 0 00112 99.94v-80a11.998 11.998 0 00-12-12zm-8 69.24a1.69 1.69 0 01-.85 1.45l-30.31 17.1a1.77 1.77 0 01-1.67 0l-30.32-17.1a1.689 1.689 0 01-.85-1.45V42.82a1.66 1.66 0 01.85-1.45l30.32-17.21a1.71 1.71 0 011.67 0l30.31 17.21a1.67 1.67 0 01.85 1.45v34.36z" />
            </svg>
            <div class="text">
              <h4>Ohne Hintergrund</h4>
              <p>
                Die besten Ergebnisse erhältst Du, wenn das gesuchte Objekt mit einfarbigem und hellem Hintergrund zu sehen ist.
              </p>
            </div>
          </vviinn-slide>
        </vviinn-slider>
      </Host>
    );
  }
}
