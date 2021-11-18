document.querySelector(".nav__el--logout").addEventListener('click', () => {
    try{
        fetch('/api/v1/users/loggedOut', {
            method: 'GET'
        })
        .then( res => res.json())
        .then( data => {
            if(data.status === 'success') location.reload(true);

        }).catch( err => {
            alert(err.message)
        })

    }catch(err) {

    }
})