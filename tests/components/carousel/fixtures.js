export const carouselWithoutIndicators = `
    <section class="carousel" aria-label="Featured slides">
      <div class="carousel-control-container">
        <button type="button" class="carousel-control autoplay">Play</button>
        <button type="button" class="carousel-control previous">Previous</button>
        <button type="button" class="carousel-control next">Next</button>
      </div>
      <div class="carousel-item-container">
        <div class="carousel-item" id="first-slide">First slide</div>
        <div class="carousel-item" id="last-slide">Last slide</div>
      </div>
    </section>
  `;

export const carouselWithIndicators = `
  <section class="carousel" aria-label="Featured slides">
    <div class="carousel-control-container">
      <button type="button" class="carousel-control autoplay">Play</button>
      <button type="button" class="carousel-control previous">Previous</button>
      <button type="button" class="carousel-control next">Next</button>
    </div>
    <div class="carousel-tab-container" role="group" aria-label="Choose a slide">
      <button type="button" class="carousel-tab">First slide</button>
      <button type="button" class="carousel-tab">Second slide</button>
      <button type="button" class="carousel-tab">Third slide</button>
    </div>
    <div class="carousel-item-container">
      <div class="carousel-item" id="first-slide" tabindex="0">First slide</div>
      <div class="carousel-item" tabindex="0">Second slide</div>
      <div class="carousel-item" tabindex="0">Third slide</div>
    </div>
  </section>
`;
