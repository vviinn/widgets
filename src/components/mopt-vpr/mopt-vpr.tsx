import { Component, ComponentInterface, Host, h, Prop, State, Element } from '@stencil/core';
import { getRecommendations } from '../../services/recommendationsService';
import { Recommendation } from '../../interfaces/recommendation';
import { fold } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';

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
    const runRequest = await getRecommendations();

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
