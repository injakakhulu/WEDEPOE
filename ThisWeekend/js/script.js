// ========= THISWEEKEND EVENT FILTER SCRIPT ==========

// ========= DEFAULT EVENTS =========
window.defaultEvents = [
    {
        title: "Summer Beats Festival",
        description: "Join us for an unforgettable night of live music and entertainment.",
        date: "2025-08-25T18:00:00",
        time: "18:00",
        category: "music",
        province: "gauteng",
        city: "johannesburg",
        image: "images/pexels-barbara-oliveira-734188-1578317.jpg"
    },
    {
        title: "Art in the City",
        description: "Explore stunning artworks from local artists in Nelspruit.",
        date: "2025-08-30T10:00:00",
        time: "10:00",
        category: "art",
        province: "mpumalanga",
        city: "nelspruit",
        image: "images/pexels-barbara-oliveira-734188-1578317.jpg"
    },
    {
        title: "Charity Football Match",
        description: "Support a good cause and enjoy a thrilling game of football.",
        date: "2025-09-05T14:00:00",
        time: "14:00",
        category: "sports",
        province: "kwazulu-natal",
        city: "durban",
        image: "images/pexels-barbara-oliveira-734188-1578317.jpg"
    }
];


// ========= GET ALL EVENTS =========
function getAllEvents() {
    const savedEvents = JSON.parse(localStorage.getItem("thisWeekendEvents")) || [];
    return [...window.defaultEvents, ...savedEvents];  // Return both default and saved events
}

// ========= DISPLAY EVENTS FUNCTION =========
function displayEvents(events) {
    const container = document.getElementById("eventsList");
    if (!container) return;

    container.innerHTML = "<h2>Upcoming Events</h2>";  // Add heading

    if (events.length === 0) {
        container.innerHTML += `<p class="no-events">No events found.</p>`;  // Show a message if no events
        return;
    }

    events.forEach(event => {
        const card = document.createElement("article");
        card.classList.add("event-card");

        card.innerHTML = `
            <img src="${event.image}" alt="Event Image">
            <h3>${event.title}</h3>
            <p>${event.description}</p>
            <p><strong>Date:</strong> ${event.date.split("T")[0]}</p>
            <p><strong>Time:</strong> ${event.time}</p>
            <p><strong>Location:</strong> ${event.city}, ${event.province}</p>
            <p><strong>Category:</strong> ${event.category}</p>
            <p><strong>Countdown:</strong> <span class="countdown" data-date="${event.date}"></span></p>
        `;

        container.appendChild(card);
    });

    startCountdowns();  // Start countdown timers for each event
}

// ========= APPLY FILTERS =========
function applyFilters() {
    const category = document.getElementById("filterCategory").value;
    const province = document.getElementById("filterProvince").value;
    const city = document.getElementById("filterCity").value;

    const allEvents = getAllEvents();

    const filtered = allEvents.filter(ev => 
        (category === "all" || ev.category === category) &&
        (province === "all" || ev.province === province) &&
        (city === "all" || ev.city === city)
    );

    displayEvents(filtered);
}

// ========= COUNTDOWN FUNCTION =========
function startCountdowns() {
    const countdownEls = document.querySelectorAll(".countdown");

    countdownEls.forEach(el => {
        const eventDate = new Date(el.dataset.date);

        function updateCountdown() {
            const now = new Date();
            const diff = eventDate - now;

            if (diff <= 0) {
                el.innerText = "Lusuku Olukulu Yenz'Umlando!!!";
                el.style.color = "green";
                el.style.fontWeight = "bold";
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);

            el.innerText = `${days}d ${hours}h ${minutes}m ${seconds}s`;

            // Highlight if less than 24 hours remaining
            if (diff <= 24 * 60 * 60 * 1000) {
                el.style.color = "red";
                el.style.fontWeight = "bold";
            } else {
                el.style.color = "";
                el.style.fontWeight = "";
            }
        }

        updateCountdown();
        setInterval(updateCountdown, 1000);
    });
}

// ========= INITIALIZE PAGE =========
document.addEventListener("DOMContentLoaded", () => {
    // Display all events (default + saved) when the page loads
    displayEvents(getAllEvents());  

    // Add event listener to apply filters
    const filterBtn = document.getElementById("applyFilters");
    if (filterBtn) filterBtn.addEventListener("click", applyFilters);
});

/////////////////////////////////////////////////////////////////////

// Form validation and event submission (submit-event.html)
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("submitEventForm");
    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const title = document.getElementById("eventTitle").value.trim();
        const desc = document.getElementById("eventDescription").value.trim();
        const date = document.getElementById("eventDate").value;
        const time = document.getElementById("eventTime").value;
        const imageFile = document.getElementById("eventImage").files[0];
        const category = document.getElementById("category").value;
        const province = document.getElementById("province").value;
        const city = document.getElementById("city").value.trim();

        let errors = [];

        if (!title) errors.push("Event title is required.");
        if (!desc) errors.push("Description is required.");
        if (!date) errors.push("Event date is required.");
        if (!time) errors.push("Event time is required.");
        if (!imageFile) errors.push("Image is required.");
        if (!category) errors.push("Category required.");
        if (!province) errors.push("Province required.");
        if (!/^[A-Za-z\s]+$/.test(city)) errors.push("City must contain letters only.");

        if (errors.length > 0) {
            alert(errors.join("\n"));
            return;
        }

        // Save event
        const reader = new FileReader();
        reader.onload = () => {
            const newEvent = {
                title,
                description: desc,
                date,
                time,
                category,
                province,
                city,
                image: reader.result
            };

            let saved = JSON.parse(localStorage.getItem("thisWeekendEvents")) || [];
            saved.push(newEvent);
            localStorage.setItem("thisWeekendEvents", JSON.stringify(saved));

            alert("Event saved! Check it on the Events page.");
            form.reset();
            document.getElementById("imagePreviewContainer").style.display = "none";
        };

        reader.readAsDataURL(imageFile);
    });
});

// Image preview for event submission form
document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("eventImage");
    const box = document.getElementById("imagePreviewContainer");
    const img = document.getElementById("imagePreview");

    if (!input) return;

    input.addEventListener("change", () => {
        const file = input.files[0];
        if (!file) {
            box.style.display = "none";
            img.src = "";
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            img.src = reader.result;
            box.style.display = "block";
        };
        reader.readAsDataURL(file);
    });
});

////////Testimonials handling (Optional feature)///////////////////
document.addEventListener("DOMContentLoaded", () => {
    // ======== Handle Testimonials ========
    const testimonialForm = document.getElementById("testimonialForm");
    const testimonialList = document.getElementById("testimonialList");

    // Load and display saved testimonials
    function displayTestimonials() {
        const savedTestimonials = JSON.parse(localStorage.getItem("communityTestimonials")) || [];
        savedTestimonials.forEach(testimonial => {
            const div = document.createElement("div");
            div.classList.add("testimonial");
            div.innerHTML = `<p>“${testimonial.message}”</p><span>- ${testimonial.name}</span>`;
            testimonialList.appendChild(div);
        });
    }

    // Submit new testimonial
    testimonialForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("userName").value.trim();
        const message = document.getElementById("userTestimonial").value.trim();

        if (!name || !message) {
            alert("Please fill in both fields.");
            return;
        }

        const newTestimonial = { name, message };
        let savedTestimonials = JSON.parse(localStorage.getItem("communityTestimonials")) || [];
        savedTestimonials.push(newTestimonial);
        localStorage.setItem("communityTestimonials", JSON.stringify(savedTestimonials));

        // Display the new testimonial
        displayTestimonials();

        // Clear form fields
        testimonialForm.reset();
        alert("Thank you! Your testimonial has been submitted.");
    });

    // Display testimonials on page load
    displayTestimonials();

    // ======== Handle Gallery Photos ========
    const photoForm = document.getElementById("photoForm");
    const galleryGrid = document.getElementById("galleryGrid");

    // Load and display saved photos
    function displayGallery() {
        const savedPhotos = JSON.parse(localStorage.getItem("communityGallery")) || [];
        savedPhotos.forEach(photoData => {
            const img = document.createElement("img");
            img.src = photoData.image;
            img.alt = "Community Event Photo";
            galleryGrid.appendChild(img);
        });
    }

    // Submit new photo
    photoForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const fileInput = document.getElementById("photoFile");
        const file = fileInput.files[0];

        if (!file) {
            alert("Please select an image.");
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const newPhoto = { image: reader.result };
            let savedPhotos = JSON.parse(localStorage.getItem("communityGallery")) || [];
            savedPhotos.push(newPhoto);
            localStorage.setItem("communityGallery", JSON.stringify(savedPhotos));

            // Display the new image in the gallery
            const img = document.createElement("img");
            img.src = reader.result;
            img.alt = "Community Event Photo";
            galleryGrid.appendChild(img);

            // Clear file input
            photoForm.reset();
            alert("Thank you! Your photo has been submitted.");
        };

        reader.readAsDataURL(file);
    });

    // Display photos on page load
    displayGallery();
});
/*****************************************************
 * FEATURED EVENTS ON INDEX PAGE
 *****************************************************/
document.addEventListener("DOMContentLoaded", function () {
    const carousel = document.getElementById("featuredCarousel");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    // Load saved events from LocalStorage
    function loadSavedEvents() {
        const saved = localStorage.getItem("thisWeekendEvents");
        if (!saved) return [];
        return JSON.parse(saved);
    }

    // Get only upcoming events
    function getUpcomingEvents() {
        const events = loadSavedEvents();
        const today = new Date().setHours(0, 0, 0, 0);

        return events.filter(event => {
            const eventDate = new Date(event.date).setHours(0, 0, 0, 0);
            return eventDate >= today; // filter out past events
        });
    }

    // Use upcoming events for the carousel
    let events = getUpcomingEvents();

    let currentIndex = 0;

    function displayEvents() {
        carousel.innerHTML = ''; // Clear the previous events

        if (events.length === 0) {
            carousel.innerHTML = `<p>No upcoming events</p>`;
            return;
        }

        // Display up to 2 events at a time
        for (let i = currentIndex; i < currentIndex + 2; i++) {
            if (events[i]) {
                const eventCard = document.createElement('div');
                eventCard.classList.add('event-card');
                eventCard.innerHTML = `
                    <img src="${events[i].image}" alt="${events[i].title}">
                    <h4>${events[i].title}</h4>
                    <p>${events[i].description}</p>
                    <p><strong>${new Date(events[i].date).toLocaleDateString()}</strong></p>
                `;
                carousel.appendChild(eventCard);
            }
        }
    }

    nextBtn.addEventListener("click", function () {
        if (currentIndex < events.length - 2) {
            currentIndex += 2;
            displayEvents();
        }
    });

    prevBtn.addEventListener("click", function () {
        if (currentIndex > 0) {
            currentIndex -= 2;
            displayEvents();
        }
    });

    // Auto-scroll the carousel every 5 seconds
    setInterval(function () {
        if (events.length <= 2) return;
        if (currentIndex < events.length - 2) {
            currentIndex += 2;
        } else {
            currentIndex = 0;
        }
        displayEvents();
    }, 5000);

    // Initial display of events
    displayEvents();
});
/* ===============================
   CONTACT FORM: SAVE MESSAGES
   =============================== */

document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.querySelector(".contact-form form");
    if (!contactForm) return; // Only run on contact.html

    contactForm.addEventListener("submit", function (e) {
        e.preventDefault(); // Stop page reload

        // Get form values
        const name = document.querySelector("#name").value.trim();
        const email = document.querySelector("#email").value.trim();
        const subject = document.querySelector("#subject").value.trim();
        const message = document.querySelector("#message").value.trim();

        // Validation
        if (!name || !email || !message) {
            alert("Please fill in all required fields.");
            return;
        }

        // Create message object
        const newMessage = {
            name,
            email,
            subject,
            message,
            dateSent: new Date().toLocaleString()
        };

        // Load existing messages
        let savedMessages = JSON.parse(localStorage.getItem("contactMessages")) || [];

        // Add new one
        savedMessages.push(newMessage);

        // Save back to localStorage
        localStorage.setItem("contactMessages", JSON.stringify(savedMessages));

        // Success alert
        alert("Your message has been sent successfully!");

        // Reset form
        contactForm.reset();
    });
});
// Auto-update year in footer
document.getElementById("year").textContent = new Date().getFullYear();

// Hero fade-in animation
window.addEventListener("load", () => {
  const title = document.querySelector(".hero-title");
  const subtitle = document.querySelector(".hero-subtitle");

  setTimeout(() => title.classList.add("fade-in"), 200);     // fade-in title
  setTimeout(() => subtitle.classList.add("fade-in"), 600);  // fade-in subtitle
});

document.getElementById("menuToggle").addEventListener("click", function () {
    const navLinks = document.getElementById("navLinks");
    navLinks.style.display = navLinks.style.display === "flex" ? "none" : "flex";
});

