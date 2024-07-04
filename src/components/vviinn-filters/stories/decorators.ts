export const filtersDecorator = (story) => `
<style>
.story-filters-wrapper{}
</style>
<div class="story-filters-wrapper">
  ${story()}
</div>
`;

export const extendedFiltersDecorator = (story) => `
<style>
.story-extended-filters-wrapper{    
  display: flex;
  justify-content: end;
}
</style>
<div class="story-extended-filters-wrapper">
  ${story()}
</div>
`;
