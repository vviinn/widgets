import { newE2EPage } from '@stencil/core/testing';

describe('vpr-slidable', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<vpr-slidable></vpr-slidable>');

    const element = await page.find('vpr-slidable');
    expect(element).toHaveClass('hydrated');
  });
});
