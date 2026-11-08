
/* ==============================
   FLIGHT DATA
================================ */

const flights = [
    {
        airline: "IndiGo",
        code: "6E 2045",
        departure: "06:00 AM",
        arrival: "08:15 AM",
        duration: 135,
        price: 4500
    },
    {
        airline: "Air India",
        code: "AI 560",
        departure: "09:30 AM",
        arrival: "11:45 AM",
        duration: 135,
        price: 6200
    },
    {
        airline: "SpiceJet",
        code: "SG 812",
        departure: "02:00 PM",
        arrival: "04:30 PM",
        duration: 150,
        price: 3900
    }
];

/* ==============================
   HTML ELEMENTS
================================ */

const flightList = document.getElementById("flightList");
const flightForm = document.getElementById("flightForm");

const dateInput = document.getElementById("date");
const returnInput = document.getElementById("returnDate");

const bookingModal = document.getElementById("bookingModal");

/* ==============================
   DATE SETUP
================================ */

// Use local date instead of UTC date.

function getToday() {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

const today = getToday();

dateInput.min = today;
dateInput.value = today;

returnInput.min = today;

/* ==============================
   TRIP TYPE
================================ */

document.querySelectorAll('input[name="trip"]').forEach(radio => {

    radio.addEventListener("change", function () {

        const roundTrip = this.value === "Round Trip";

        returnInput.disabled = !roundTrip;
        returnInput.required = roundTrip;

        if (!roundTrip) {
            returnInput.value = "";
        }
    });

});

/* ==============================
   DEPARTURE DATE
================================ */

dateInput.addEventListener("change", function () {

    returnInput.min = this.value;

    if (returnInput.value && returnInput.value < this.value) {
        returnInput.value = "";
    }

});

/* ==============================
   DISPLAY FLIGHTS
================================ */

function displayFlights() {

    const sort = document.getElementById("sort").value;

    const sortedFlights = [...flights];

    if (sort === "price") {

        sortedFlights.sort((a, b) => a.price - b.price);

    } else {

        sortedFlights.sort((a, b) => a.duration - b.duration);

    }

    // Clear previous flight cards.

    flightList.innerHTML = "";

    sortedFlights.forEach(flight => {

        const card = document.createElement("div");
        card.className = "flight-card";

        // Airline information.

        const airline = document.createElement("div");

        const name = document.createElement("h3");
        name.className = "airline-name";
        name.textContent = flight.airline;

        const code = document.createElement("p");
        code.className = "flight-code";
        code.textContent = flight.code;

        airline.append(name, code);

        // Departure information.

        const departure = document.createElement("div");
        departure.className = "flight-time";

        const departureTime = document.createElement("h3");
        departureTime.textContent = flight.departure;

        const departureLabel = document.createElement("p");
        departureLabel.textContent = "Departure";

        departure.append(departureTime, departureLabel);

        // Arrival information.

        const arrival = document.createElement("div");
        arrival.className = "flight-time";

        const arrivalTime = document.createElement("h3");
        arrivalTime.textContent = flight.arrival;

        const arrivalLabel = document.createElement("p");
        arrivalLabel.textContent = "Arrival";

        arrival.append(arrivalTime, arrivalLabel);

        // Price information.

        const priceSection = document.createElement("div");
        priceSection.className = "price-section";

        const price = document.createElement("div");
        price.className = "price";

        price.textContent =
            "₹" + flight.price.toLocaleString("en-IN");

        const perPerson = document.createElement("small");
        perPerson.textContent = "Per passenger";

        // Booking button.

        const bookButton = document.createElement("button");
        bookButton.className = "book-btn";
        bookButton.textContent = "Book Now";

        bookButton.addEventListener("click", function () {
            bookFlight(flight);
        });

        priceSection.append(price, perPerson, bookButton);

        // Add all sections to card.

        card.append(
            airline,
            departure,
            arrival,
            priceSection
        );

        flightList.appendChild(card);

    });

}

/* ==============================
   SORT FLIGHTS
================================ */

document.getElementById("sort").addEventListener("change", function () {

    displayFlights();

});

/* ==============================
   SEARCH FLIGHTS
================================ */

flightForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const from = document.getElementById("from").value.trim();
    const to = document.getElementById("to").value.trim();

    const tripType = document.querySelector(
        'input[name="trip"]:checked'
    ).value;

    if (from.toLowerCase() === to.toLowerCase()) {

        alert("Departure and destination cannot be the same.");

        return;
    }

    if (tripType === "Round Trip" && !returnInput.value) {

        alert("Please select your return date.");

        return;
    }

    if (returnInput.value && returnInput.value < dateInput.value) {

        alert("Return date must be after departure date.");

        return;
    }

    // Update route.

    document.getElementById("route").textContent =
        from + " → " + to;

    // Display available flights.

    displayFlights();

    // Scroll to results.

    document.getElementById("flights").scrollIntoView({
        behavior: "smooth"
    });

});

/* ==============================
   BOOK FLIGHT
================================ */

function bookFlight(flight) {

    const passengers = Number(
        document.getElementById("passengers").value
    );

    const from = document.getElementById("from").value.trim();

    const to = document.getElementById("to").value.trim();

    const total = flight.price * passengers;

    document.getElementById("bookingDetails").textContent =
        `${flight.airline}: ${from} to ${to}. ` +
        `${passengers} passenger(s). Total: ₹${total.toLocaleString("en-IN")}.`;

    // Show modal.

    bookingModal.style.display = "flex";

}

/* ==============================
   CLOSE MODAL
================================ */

function closeModal() {

    bookingModal.style.display = "none";

}

/* Close modal when clicking outside. */

bookingModal.addEventListener("click", function (event) {

    if (event.target === bookingModal) {
        closeModal();
    }

});

/* Close modal using Escape key. */

document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {
        closeModal();
    }

});

/* ==============================
   INITIALIZE APPLICATION
================================ */

displayFlights();

console.log("SkyFly application loaded successfully!");
