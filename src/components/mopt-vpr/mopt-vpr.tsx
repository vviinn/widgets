import { Component, ComponentInterface, Host, h, Prop, State, Element } from '@stencil/core';
import { getRecommendations } from '../../services/recommendationsService';
import { pipe } from 'fp-ts/lib/pipeable';
import * as TE from 'fp-ts/lib/TaskEither';
import * as E from 'fp-ts/lib/Either';
import { authOptionsFromToken } from './token-helpers';
import { Interfaces } from '../../interfaces/recommendation';
import state from '../../store/store';

const emptyId = (x: string): E.Either<Error, string> =>
  x.length === 0 ? E.left(new Error('Product id is empty')) : E.right(x);

const getProductId = (x: string): E.Either<Error, string> => pipe(
  E.fromNullable(new Error('Product id not provided'))(x),
  E.chain(emptyId)
);

@Component({
  tag: 'mopt-vpr',
  styleUrl: 'mopt-vpr.css',
  shadow: true,
})
export class MoptVpr implements ComponentInterface {
  @Element() el: HTMLElement;
  /** Title for recommendations widget */
  @Prop() blockTitle: string = 'Recommended products';
  /** Number of columns for recommendations */
  @Prop() columns: number = 4;
  /** Ratio of each recommended product image */
  @Prop() imageRatio: number = 1.5;
  /** Width of each recommended product image */
  @Prop() imageWidth: number = 150;
  /** Id of product you need recommendations for */
  @Prop() productId: string;
  /** Mediaopt customer token */
  @Prop() token: string;
  /** Currency sign will shown after price */
  @Prop() currencySign: string;
  /** prefix will shown before price */
  @Prop() pricePrefix: string;

  @State() recommendations: Interfaces['VisualProductSearch'][] = [];
  @State() loaded: boolean = false;

  private cssPartsDetector: HTMLDivElement;

  componentDidLoad() {
    const detectorBounds = this.cssPartsDetector.getBoundingClientRect();

    if(detectorBounds.width === 0 && detectorBounds.height === 0) {
      state.fallbackStyles = document.head.getElementsByTagName('style')['kek'].textContent.replace(/(?:mopt-vpr::part\()(\w+)-(\w+)\)/g, '.$1.$2');
    }
  }

  async componentWillLoad() {
    this.el.style.setProperty('--column-width', `${this.imageWidth}px`);

    state.pricePrefix = this.pricePrefix;
    state.currencySign = this.currencySign;

    const request = pipe(
      TE.right(getRecommendations),
      TE.ap(TE.fromEither(getProductId(this.productId))),
      TE.ap(TE.fromEither(authOptionsFromToken(this.token))),
      TE.flatten
    );

    const runRequest = await request();

    pipe(
      runRequest,
      E.fold(
        (error) => this.handleError(error),
        (data) => this.handleRecommendationsSucces(data)
      )
    );
  }

  handleError(error: Error):any {
    console.log('ERROR:', error);
  }

  async handleRecommendationsSucces(data: Promise<any>): Promise<void> {
    const response = await data
    this.recommendations = response.extended;
    this.loaded = true;
  }

  render() {
    return (
      <Host class={{loaded: this.loaded}}
            aria-hidden={this.loaded ? 'false' : 'true'}>
          <style>{state.fallbackStyles}</style>
          <h2 part="recommendations-title">{ this.blockTitle }</h2>
          <div class="results"
               data-columns={this.columns}>
              { this.recommendations.map(r => (
                <vpr-result item={r}
                            imageWidth={this.imageWidth}
                            imageRatio={this.imageRatio} />
                ))}
          </div>
          <div class="visually-hidden"
               part="shadow-parts-detect"
               ref={(el) => this.cssPartsDetector = el }>
          </div>
      </Host>
    );
  }

}
