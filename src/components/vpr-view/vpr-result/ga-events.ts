import { pipe } from 'fp-ts/lib/pipeable';
import { fromNullable, fold } from 'fp-ts/lib/Option';
import { Interfaces } from '../../../interfaces/recommendation';

export const sendEvent = (product: Interfaces['VisualProductSearch']) => 
  pipe(
    fromNullable(window.gtag),
    fold(
      () => null,
      () => gtag('event', 'view_item_list', {
        items: [
          {
            id: product.productId,
            name: product.title,
            brand: product.brand ?? '',
            category: product.productType ?? '',
            list: 'VI Recommendations',
            price: product.price ?? ''
          }
        ]
      })
    )
  );

export const sendBeacon = (_action: string, _label: string) => 
  pipe(
    fromNullable(window.ga),
    fold(
      () => null,
      () => {
        ga('set', 'transport', 'beacon');
        sendEvent({})
      }
    )
  );
