import { Component, ComponentInterface, Host, h, Prop, State, Element } from '@stencil/core';
import { getRecommendations } from '../../services/recommendationsService';
import { Recommendation } from '../../interfaces/recommendation';
import { fold } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';
import { Option, none, some, ap, getOrElse } from 'fp-ts/lib/Option';
import { FetchOptions } from '../../interfaces/fetch-options';

const fromNullableString = (x: string | null | undefined):Option<string> => {
  if(x === null || x === undefined || x.length === 0) {
    return none;
  }

  return some(x);
};

const getAuthString = (x: string | null | undefined, y: string | null | undefined): Option<string> =>
  pipe(
    some((a: string) => (b: string) => {
      const creds = `${a}:${b}`;
      const encoded = btoa(creds);
      
      return `Basic ${encoded}`;
    }),
    ap(fromNullableString(x)),
    ap(fromNullableString(y))
  );

const authStringOrEmpty = (x: string | null | undefined, y: string | null | undefined): string => pipe(
  getAuthString(x, y),
  getOrElse(() => '')
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
  @Prop() username: string;
  @Prop() password: string;

  @State()
  recommendations: any[] = [];

  async componentWillLoad() {
    this.el.style.setProperty('--column-width', `${this.imageWidth}px`);
    const authString = authStringOrEmpty(this.username, this.password);
    const options: FetchOptions = {
      headers: new Headers({
        'Authorization': authString
      })
    };
    
    const runRequest = await getRecommendations(options)();

    pipe(
      runRequest,
      fold(
        (error) => this.handleError(error),
        (data) => this.handleRecommendationsSucces(data)
      )
    );
  }

  handleError(error):any {
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
