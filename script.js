
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

const flightList = document.getElementById("flightList");
const dateInput = document.getElementById("date");
const returnInput = document.getElementById("returnDate");

const today = new Date().toISOString().split("T")[0];

dateInput.min = today;
dateInput.value = today;
returnInput.min = today;

document.querySelectorAll('input[name="trip"]').forEach(radio => {
    radio.addEventListener("change", function () {
        const roundTrip = this.value === "Round Trip";
        returnInput.disabled = !roundTrip;
        returnInput.required = roundTrip;
    });
});

dateInput.addEventListener("change", function () {
    returnInput.min = this.value;
});

function displayFlights() {
    const sort = document.getElementById("sort").value;
    const sortedFlights = [...flights];

    if (sort === "price") {
        sortedFlights.sort((a, b) => a.price - b.price);
    } else {
        sortedFlights.sort((a, b) => a.duration - b.duration);
    }

    flightList.innerHTML = "";

    sortedFlights.forEach(flight => {
        const card = document.createElement("div");
        card.className = "flight-card";

        const airline = document.createElement("div");
        const name = document.createElement("h3");
        name.className = "airline-name";
        name.textContent = flight.airline;

        const code = document.createElement("p");
        code.className = "flight-code";
        code.textContent = flight.code;

        airline.append(name, code);

        const departure = document.createElement("div");
        departure.className = "flight-time";

        const departureTime = document.createElement("h3");
        departureTime.textContent = flight.departure;

        const departureLabel = document.createElement("p");
        departureLabel.textContent = "Departure";

        departure.append(departureTime, departureLabel);

        const arrival = document.createElement("div");
        arrival.className = "flight-time";

        const arrivalTime = document.createElement("h3");
        arrivalTime.textContent = flight.arrival;

        const arrivalLabel = document.createElement("p");
        arrivalLabel.textContent = "Arrival";

        arrival.append(arrivalTime, arrivalLabel);

        const priceSection = document.createElement("div");
        priceSection.className = "price-section";

        const price = document.createElement("div");
        price.className = "price";
        price.textContent = "₹" + flight.price.toLocaleString("en-IN");

        const perPerson = document.createElement("small");
        perPerson.textContent = "Per passenger";

        const bookButton = document.createElement("button");
        bookButton.className = "book-btn";
        bookButton.textContent = "Book Now";

        bookButton.addEventListener("click", () => bookFlight(flight));

        priceSection.append(price, perPerson, bookButton);

        card.append(airline, departure, arrival, priceSection);
        flightList.appendChild(card);
    });
}

document.getElementById("sort").addEventListener("change", displayFlights);

document.getElementById("flightForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const from = document.getElementById("from").value.trim();
    const to = document.getElementById("to").value.trim();

    if (from.toLowerCase() === to.toLowerCase()) {
        alert("Departure and destination cannot be the same.");
        return;
    }

    if (returnInput.value && returnInput.value < dateInput.value) {
        alert("Return date must be after departure date.");
        return;
    }

    document.getElementById("route").textContent = from + " → " + to;

    displayFlights();

    document.getElementById("flights").scrollIntoView({
        behavior: "smooth"
    });
});

function bookFlight(flight) {
    const passengers = Number(document.getElementById("passengers").value);
    const from = document.getElementById("from").value.trim();
    const to = document.getElementById("to").value.trim();

    const total = flight.price * passengers;

    document.getElementById("bookingDetails").textContent =
        `${flight.airline}: ${from} to ${to}. ` +
        `${passengers} passenger(s). Total: ₹${total.toLocaleString("en-IN")}.`;

    document.getElementById("bookingModal").style.display = "flex";
}

function closeModal() {
    document.getElementById("bookingModal").style.display = "none";
}

displayFlights();
