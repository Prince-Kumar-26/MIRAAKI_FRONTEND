//for local hosting of backend
fetch("http://localhost:5000/api/data")
   .then(res => res.json())
   .then(data => console.log(data))
   .catch(err => console.error(err));

// code for newsletter fetching
document.querySelector(".newsletter-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = this.querySelector("input[type='email']").value;

  fetch("http://localhost:5000/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email })
  })
  .then(res => res.json())
  .then(data => alert(data.message))
  .catch(err => console.error("Error:", err));
});

// code for feedback of fetching into backend
document.querySelectorAll(".newsletter-form")[1].addEventListener("submit", function (e) {
  e.preventDefault();

  const name = this.querySelector("input[type='text']").value;
  const email = this.querySelector("input[type='email']").value;
  const message = this.querySelector("textarea").value;

  fetch("http://localhost:5000/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name, email: email, message: message })
  })
  .then(res => res.json())
  .then(data => alert(data.message))
  .catch(err => console.error("Error:", err));
});



document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('menucard');
  if(hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
  }

  // Scroll Animations Configuration
  const createObserver = (elements, threshold, callback) => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting) callback(entry.target);
      });
    }, { threshold });
    
    elements.forEach(element => observer.observe(element));
  };

  // Card Animations
  createObserver(document.querySelectorAll('.card'), 0.1, (card) => {
    card.classList.add('visible');
  });

  // Course Card Animations
  createObserver(document.querySelectorAll('.course-card'), 0.2, (card) => {
    card.classList.add('visible');
  });

  // Product Card Animations
  createObserver(document.querySelectorAll('.product-card'), 0.1, (card) => {
    card.classList.add('visible');
  });

  // Form Container Animations
  createObserver(document.querySelectorAll('.form-container'), 0.1, (form) => {
    form.classList.add('visible');
  });
  
    // Scroll animation for cards
    const cards = document.querySelectorAll('.card');
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px'
    };
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);
  
    cards.forEach(card => {
      observer.observe(card);
    });
  
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
          behavior: 'smooth'
        });
      });
    });
  });

  // Previous JavaScript remains

// Add these new animations
// Title underline animation
document.querySelectorAll('.animate-title').forEach(title => {
    title.addEventListener('mouseenter', () => {
      title.classList.add('hovered');
    });
    title.addEventListener('mouseleave', () => {
      title.classList.remove('hovered');
    });
  });
  
  // // Card shine animation
  // document.querySelectorAll('.card').forEach(card => {
  //   card.addEventListener('mousemove', (e) => {
  //     const rect = card.getBoundingClientRect();
  //     const x = e.clientX - rect.left;
  //     const y = e.clientY - rect.top;
  //     card.style.setProperty('--x', `${x}px`);
  //     card.style.setProperty('--y', `${y}px`);
  //   });
  // });

    // Card Shine Animation
    document.querySelectorAll('.card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--x', `${e.clientX - rect.left}px`);
        card.style.setProperty('--y', `${e.clientY - rect.top}px`);
      });
    });
  // Course card animation
const courseCards = document.querySelectorAll('.course-card');
const courseObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.2 });

courseCards.forEach(card => {
  courseObserver.observe(card);
});

// Marketplace Animations
const productCards = document.querySelectorAll('.product-card');
const productObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

productCards.forEach(card => {
  productObserver.observe(card);
});

  // Marketplace Button Animation
  const marketplaceBtn = document.querySelector('.marketplace-btn');
  if(marketplaceBtn) {
    marketplaceBtn.addEventListener('mouseenter', () => {
      marketplaceBtn.style.animation = 'pulse 2s infinite';
    });
    marketplaceBtn.addEventListener('mouseleave', () => {
      marketplaceBtn.style.animation = '';
    });
  }
// Filter Functionality
document.querySelectorAll('.filter-btn').forEach(button => {
  button.addEventListener('click', function() {
    // Remove active class from all buttons
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    
    // Add active class to clicked button
    this.classList.add('active');
    
    // Get filter value
    const filter = this.dataset.filter;
    
    // Filter products
    document.querySelectorAll('.product-card').forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// Load More Button
document.getElementById('loadMore')?.addEventListener('click', function() {
  // Simulate loading more items
  const newProducts = Array(3).fill().map((_, i) => `
    <div class="product-card" data-category="art">
      <!-- Product card structure -->
    </div>
  `).join('');
  
  document.querySelector('.product-grid').insertAdjacentHTML('beforeend', newProducts);
  
  // Re-initialize observer for new cards
  document.querySelectorAll('.product-card:not(.visible)').forEach(card => {
    productObserver.observe(card);
  });
  
  // Show confirmation animation
  this.classList.add('loading');
  setTimeout(() => this.classList.remove('loading'), 1000);
});

// // Footer animations
// const footerSections = document.querySelectorAll('.footer-section');

// footerSections.forEach(section => {
//   section.style.opacity = '0';
//   section.style.transform = 'translateY(20px)';
// });
// Footer Animations
createObserver(document.querySelectorAll('.footer-section'), 0.1, (section) => {
  section.style.opacity = '1';
  section.style.transform = 'translateY(0)';
});

const footerObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      entry.target.style.transition = 'all 0.5s ease';
    }
  });
}, { threshold: 0.1 });

footerSections.forEach(section => {
  footerObserver.observe(section);
});

// Newsletter/Feedback Section Animation
const formContainers = document.querySelectorAll('.form-container');
const formObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

formContainers.forEach(container => {
  formObserver.observe(container);
});

 // Smooth Scroll
 document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if(target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Filter Functionality
document.querySelectorAll('.filter-btn').forEach(button => {
  button.addEventListener('click', function() {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    this.classList.add('active');
    const filter = this.dataset.filter;
    
    document.querySelectorAll('.product-card').forEach(card => {
      card.style.display = (filter === 'all' || card.dataset.category === filter) 
        ? 'block' 
        : 'none';
    });
  });
});

// Load More Button
const loadMoreBtn = document.getElementById('loadMore');
if(loadMoreBtn) {
  loadMoreBtn.addEventListener('click', function() {
    // Your load more implementation
  });
}

// video embedding of youtube on our site
// Video Modal Handling
// document.addEventListener('DOMContentLoaded', () => {
//   const enrollBtns = document.querySelectorAll('.enroll-btn');
//   const videoModal = document.getElementById('videoModal');
//   const courseVideo = document.getElementById('courseVideo');
//   const closeModal = document.querySelector('.close-modal');

//   // Open modal
//   enrollBtns.forEach(btn => {
//       btn.addEventListener('click', (e) => {
//           e.preventDefault();
//           const videoId = btn.dataset.videoId;
//           courseVideo.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;
//           videoModal.style.display = 'block';
//       });
//   });

//   // Close modal
//   closeModal.addEventListener('click', () => {
//       videoModal.style.display = 'none';
//       courseVideo.src = '';
//   });

//   window.addEventListener('click', (e) => {
//       if (e.target === videoModal) {
//           videoModal.style.display = 'none';
//           courseVideo.src = '';
//       }
//   });
// });
// Open Video Modal
function openVideo() {
  document.getElementById("videoModal").style.display = "flex";
  document.getElementById("videoFrame").src = "https://www.youtube.com/embed/FUSMFcuEOJo?autoplay=1";
}

// Close Video Modal
function closeVideo() {
  document.getElementById("videoModal").style.display = "none";
  document.getElementById("videoFrame").src = ""; // Stop video when closing
}




// code to send the data to the backend





