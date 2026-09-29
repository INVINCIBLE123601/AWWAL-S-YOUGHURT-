const quantity = document.getElementById("quantity");
const totalPrice = document.getElementById("total-price");

const increase = document.getElementById("increase");
const decrease = document.getElementById("decrease");

const landmark = document.getElementById("landmark");
const fullName = document.getElementById("full-name");
const phone = document.getElementById("phone");

const proceedPayment = document.getElementById("proceed-payment");
const paymentSection = document.getElementById("payment-section");
const paymentAmount = document.getElementById("payment-amount");

const paymentMade = document.getElementById("payment-made");
const confirmation = document.getElementById("confirmation");

const price = 1200;


// UPDATE TOTAL PRICE
function updateTotal() {
    const total = Number(quantity.value) * price;

    totalPrice.textContent = total.toLocaleString();
    paymentAmount.textContent = total.toLocaleString();
}


// INCREASE QUANTITY
increase.addEventListener("click", function () {
    quantity.value = Number(quantity.value) + 1;
    updateTotal();
});


// DECREASE QUANTITY
decrease.addEventListener("click", function () {
    if (Number(quantity.value) > 1) {
        quantity.value = Number(quantity.value) - 1;
        updateTotal();
    }
});


// MANUAL QUANTITY CHANGE
quantity.addEventListener("input", updateTotal);


// PROCEED TO PAYMENT
proceedPayment.addEventListener("click", function () {

    const name = fullName.value.trim();
    const customerPhone = phone.value.trim();
    const location = landmark.value.trim();

    const selectedYoghurt =
        document.querySelector('input[name="yoghurt"]:checked');

    if (!selectedYoghurt) {
        alert("Please choose your yoghurt.");
        return;
    }

    if (name === "") {
        alert("Please enter your full name.");
        fullName.focus();
        return;
    }

    if (customerPhone === "") {
        alert("Please enter your phone number.");
        phone.focus();
        return;
    }

    if (location === "") {
        alert("Please describe your delivery location.");
        landmark.focus();
        return;
    }

    paymentSection.style.display = "block";

    paymentAmount.textContent =
        (Number(quantity.value) * price).toLocaleString();

    paymentSection.scrollIntoView({
        behavior: "smooth"
    });
});


// PAYMENT MADE
paymentMade.addEventListener("click", async function () {

    const name = fullName.value.trim();
    const customerPhone = phone.value.trim();
    const location = landmark.value.trim();

    const selectedYoghurt =
        document.querySelector('input[name="yoghurt"]:checked');

    if (!selectedYoghurt) {
        alert("Please choose your yoghurt.");
        return;
    }

    const yoghurtName =
        selectedYoghurt.value === "plain"
            ? "Plain Yoghurt"
            : "Coconut Yoghurt";

    const total =
        Number(quantity.value) * price;

    const orderCode =
        "AWY-" +
        Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase();


    // PREPARE ORDER FOR FORMSPREE
    const formData = new FormData();

    formData.append("Customer Name", name);
    formData.append("Phone Number", customerPhone);
    formData.append("Yoghurt", yoghurtName);
    formData.append("Quantity", quantity.value);
    formData.append("Total", "₦" + total.toLocaleString());
    formData.append("Delivery Location", location);
    formData.append("Order Code", orderCode);

    // IMPORTANT:
    // Clicking this button does NOT prove that payment was actually received.
    formData.append(
        "Payment Status",
        "Customer says payment was made - VERIFY PAYMENT"
    );


    // SEND ORDER TO FORMSPREE
    try {

        paymentMade.disabled = true;
        paymentMade.textContent = "Sending Order...";

        const response = await fetch(
            "https://formspree.io/f/xaenaqrj",
            {
                method: "POST",
                body: formData,
                headers: {
                    "Accept": "application/json"
                }
            }
        );


        if (!response.ok) {
            throw new Error("Order could not be sent.");
        }


        // SHOW CONFIRMATION
        confirmation.style.display = "block";

        confirmation.innerHTML = `
            <h3>ORDER RECEIVED</h3>

            <p>
                Thank you, <b>${name}</b>!
            </p>

            <p>
                Your order has been submitted successfully.
            </p>

            <p>
                <b>Your Order Code:</b>
                ${orderCode}
            </p>

            <p>
                <b>Yoghurt:</b>
                ${yoghurtName}
            </p>

            <p>
                <b>Quantity:</b>
                ${quantity.value}
            </p>

            <p>
                <b>Total:</b>
                ₦${total.toLocaleString()}
            </p>

            <p>
                <b>Delivery Location:</b>
                ${location}
            </p>

            <p>
                Your payment has been submitted for verification.
            </p>

            <p>
                Please keep your order code.
            </p>
        `;

        confirmation.scrollIntoView({
            behavior: "smooth"
        });


        paymentMade.textContent = "Order Sent ✓";


    } catch (error) {

        alert(
            "Your order could not be sent. Please check your internet connection and try again."
        );

        paymentMade.disabled = false;
        paymentMade.textContent = "I Have Made Payment";
    }

});