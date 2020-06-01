import { Component, ComponentInterface, Host, h, Prop, State } from '@stencil/core';

@Component({
  tag: 'mopt-vpr',
  styleUrl: 'mopt-vpr.css',
  shadow: true,
})
export class MoptVpr implements ComponentInterface {
  @Prop() token: string;
  @Prop() productId: string;
  @Prop() blockTitle: string = 'Recommended products';

  @State()
  recommendations: any[] = [];

  componentWillLoad() {
    console.log(process.env.RECOMMENDATIONS_URL);
  }

  render() {
    return (
      <Host>
          <h4>{ this.blockTitle }</h4>
          <div class="results">
              { this.recommendations.map(r => (<vpr-result item={r} />))}
          </div>
      </Host>
    );
  }

}
