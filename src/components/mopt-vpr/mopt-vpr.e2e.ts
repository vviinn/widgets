import { newE2EPage } from '@stencil/core/testing';

describe('mopt-vpr', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<mopt-vpr></mopt-vpr>');

    const element = await page.find('mopt-vpr');
    expect(element).toHaveClass('hydrated');
  });
});
