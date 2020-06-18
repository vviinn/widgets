import { Component, ComponentInterface, Host, h, Prop, State, Element } from '@stencil/core';
import { getRecommendations } from '../../services/recommendationsService';
import { Recommendation } from '../../interfaces/recommendation';
import { pipe } from 'fp-ts/lib/pipeable';
import * as TE from 'fp-ts/lib/TaskEither';
import * as E from 'fp-ts/lib/Either';
import { authOptionsFromToken } from './token-helpers';

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
  @Prop() token: string;
  @Prop() productId: string;
  @Prop() blockTitle: string = 'Recommended products';
  @Prop() imageWidth: number = 150;
  @Prop() imageRatio: number = 1.5;
  @Prop() columns: number = 4;

  @State()
  recommendations: any[] = [];

  async componentWillLoad() {
    this.el.style.setProperty('--column-width', `${this.imageWidth}px`);

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

  async handleRecommendationsSucces(data: Promise<Recommendation[]>): Promise<void> {
    this.recommendations = await data;
  }

  render() {
    return (
      <Host>
          <h4>{ this.blockTitle }</h4>
          <div class="results"
               data-columns={this.columns}>
              { this.recommendations.map(r => (
                <vpr-result item={r}
                            imageWidth={this.imageWidth}
                            imageRatio={this.imageRatio}/>
                ))}
          </div>
      </Host>
    );
  }

}
