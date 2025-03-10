document.getElementById("contactForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    const data = {
      email: formData.get("email"),
      subject: formData.get("subject"),
      telephone: formData.get("phone"),
      message: `${formData.get("email")}, ${formData.get("phone")} enviou: ${formData.get("message")}`,
    };

    const response = await fetch("http://localhost:5001/api/forms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      alert("Email sent successfully!");
    } else {
      alert("Error sending email: " + result.error);
    }
  });