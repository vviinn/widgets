import { newE2EPage } from '@stencil/core/testing';

describe('vi-vpr-view', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<vi-vpr-view></vi-vpr-view>');

    const element = await page.find('vi-vpr-view');
    expect(element).toHaveClass('hydrated');
  });
});
