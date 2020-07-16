import { Component, ComponentInterface, Host, h, State } from '@stencil/core';
import * as E from 'fp-ts/lib/Either';
import { detectTouchEvent } from '../../utils/featureUtils';
import { pipe } from 'fp-ts/lib/pipeable';

@Component({
  tag: 'vpr-slidable',
  styleUrl: 'vpr-slidable.css',
  shadow: true,
})
export class VprSlidable implements ComponentInterface {
  private mode: E.Either<Error, TouchEvent> = detectTouchEvent();

  @State() body: HTMLElement;

  componentWillLoad() {
    this.body = pipe(
      this.mode,
      E.fold(
        () => <slider-mouse><slot></slot></slider-mouse>,
        () => <slider-mouse><slot></slot></slider-mouse>
      )
    )
  }

  render() {
    return (
      <Host>
          { this.body }
      </Host>
    );
  }

}
