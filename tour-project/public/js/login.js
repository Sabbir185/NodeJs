
const handleLogin = async (email, password) => {
    const data = {
        email,
        password
    }
   
    fetch('http://localhost:8080/api/v1/users/login', {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(data => {
            if(data.status === 'successful'){
                alert('login successful!');
                window.setTimeout(() => {
                    location.assign('/');
                }, 1500);

            }else if(data.status === 'failed'){
                alert('email or password invalid!!');
            }
        })
        .catch(error =>  alert('email or password invalid!') )
}

document.querySelector('.form').addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    handleLogin(email, password)
})

