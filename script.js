(function(){
  const bookingForm = document.getElementById('bookingForm');
  const confirmationMessage = document.getElementById('confirmationMessage');
  const dateInput = document.getElementById('date');
  const timeInput = document.getElementById('time');
  const sessionInput = document.getElementById('session');

  // Set today's date as min for date input
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const minDate = `${yyyy}-${mm}-${dd}`;
  dateInput.min = minDate;

  const SESSION_PRICES = {
    "Individual Photo - $45": 45.00,
    "Team Photos - $85": 85.00,
    "Individual Mixtape Video - $85": 85.00,
    "Team Mixtape Video - $125": 125.00
  };

  bookingForm.addEventListener('submit', function(e){
    e.preventDefault();
    confirmationMessage.style.display = 'none';
    confirmationMessage.textContent = '';

    if(!bookingForm.checkValidity()){
      bookingForm.reportValidity();
      return;
    }

    const selectedDate = new Date(dateInput.value + 'T00:00:00');
    const now = new Date();
    now.setHours(0,0,0,0);

    if(selectedDate < now){
      alert('Please select a valid date (today or later).');
      dateInput.focus();
      return;
    }

    const [hours, minutes] = timeInput.value.split(':').map(Number);
    if(hours < 9 || hours > 18 || (hours === 18 && minutes > 0)){
      alert('Please select a start time between 9:00 and 18:00.');
      timeInput.focus();
      return;
    }

    const sessionEndHour = hours + 2;
    if(sessionEndHour > 20 || (sessionEndHour === 20 && minutes > 0)){
      alert('Your 120-minute session cannot end after 8:00 PM. Please choose an earlier start time.');
      timeInput.focus();
      return;
    }

    const sessionType = sessionInput.value;
    const sessionPrice = SESSION_PRICES[sessionType];
    if (!sessionPrice) {
      alert("Please select a valid session.");
      return;
    }

    const bookingDetails = {
      name: bookingForm.name.value.trim(),
      email: bookingForm.email.value.trim(),
      phone: bookingForm.phone.value.trim(),
      location: bookingForm.location.value.trim(),
      date: dateInput.value,
      time: timeInput.value,
      session: sessionType
    };

    localStorage.setItem('lastBooking', JSON.stringify(bookingDetails));

    const customData = encodeURIComponent(`Phone:${bookingDetails.phone};Location:${bookingDetails.location};Date:${bookingDetails.date};Time:${bookingDetails.time};Session:${bookingDetails.session}`);
    const baseUrl = "https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=photographer@example.com";
    const itemName = encodeURIComponent(bookingDetails.session);
    const amount = sessionPrice.toFixed(2);
    const returnUrl = "https://yourwebsite.com/thankyou.html";
    const cancelUrl = "https://yourwebsite.com/cancel.html";

    let paymentUrl = `${baseUrl}&item_name=${itemName}&amount=${amount}&currency_code=USD&custom=${customData}`;
    paymentUrl += "&return=" + encodeURIComponent(returnUrl);
    paymentUrl += "&cancel_return=" + encodeURIComponent(cancelUrl);

    window.location.href = paymentUrl;
  });
})();