import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';

const getCssVar = (name: string) => (element: HTMLElement): string => getComputedStyle(element).getPropertyValue(name);

export const getNumberedCssVal = (name: string) => (element: HTMLElement): O.Option<number> => {
  const val = parseInt(getCssVar(name)(element));

  return isNaN(val) ? O.none : O.some(val);
};

const getSlot = (e: HTMLElement): O.Option<HTMLSlotElement> =>
  O.fromNullable(e.getElementsByTagName('slot')[0]);

const isEmpty = (elts: Element[]): O.Option<Element[]> =>
  elts.length > 0 ? O.some(elts) : O.none;

export const getSlotContent = (e: HTMLElement): O.Option<Element[]> =>
  pipe(
  getSlot(e),
  O.map((e) => e.assignedElements({flatten: true})),
  O.chain(isEmpty)
  );
