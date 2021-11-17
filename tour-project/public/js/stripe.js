

const bookTour = tourId => {
    const stripe = Stripe('pk_test_51IeLQQJvn90Urdz7TTW8LBbHX1k1LUFWgveadGfsJKGdiI95E1m6DKTJW9NjGgSM58J5mtzhq3FbvTs9PzLFI0nk00j42bLZfM');

    fetch(`http://localhost:8080/api/v1/bookings/checkout-session/${tourId}`)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            // payment magic
            stripe.redirectToCheckout({
                sessionId: data.session.id
            });

        }).catch(err => {
            console.log(err);
            alert(err.message)
        })
}


document.querySelector("#book-tour").addEventListener('click', e => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);

})