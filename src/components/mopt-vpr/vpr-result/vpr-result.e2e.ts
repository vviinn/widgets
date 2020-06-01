import { newE2EPage } from '@stencil/core/testing';

describe('vpr-result', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<vpr-result></vpr-result>');

    const element = await page.find('vpr-result');
    expect(element).toHaveClass('hydrated');
  });
});
