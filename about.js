// Initialize Locomotive Scroll
const scroll = new LocomotiveScroll({
    el: document.querySelector('body'),
    smooth: true,
  });
  
  // Adding scroll animations
  scroll.on('scroll', () => {
    document.querySelectorAll('[data-scroll]').forEach((el) => {
      const top = el.getBoundingClientRect().top;
      if (top < window.innerHeight * 0.8) {
        el.classList.add('is-inview');
      }
    });
  });
  