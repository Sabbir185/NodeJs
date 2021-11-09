
const handleLogin = async (email, password) => {
    console.log(email, password)

    const data = {
        email,
        password
    }
   
    await fetch('http://localhost:8080/api/v1/users/login', {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(error =>  console.log(error))
}

document.querySelector('.form').addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    handleLogin(email, password)
})