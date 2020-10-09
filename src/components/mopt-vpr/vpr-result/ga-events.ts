import { pipe } from 'fp-ts/lib/pipeable';
import { fromNullable, fold } from 'fp-ts/lib/Option';

export const sendEvent = (action: string, label: string) => 
  pipe(
    fromNullable(window.ga),
    fold(
      () => null,
      () => ga('send', {
        hitType: 'event',
        eventCategory: 'VI-Product',
        eventAction: action,
        eventLabel: label
      })
    )
  );

export const sendBeacon = (action: string, label: string) => 
  pipe(
    fromNullable(window.ga),
    fold(
      () => null,
      () => {
        ga('set', 'transport', 'beacon');
        sendEvent(action, label)
      }
    )
  );
