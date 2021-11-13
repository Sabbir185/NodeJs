
const updateSetting = (data, type) => {
    const url = type === 'password' ? 'http://localhost:8080/api/v1/users/updateMyPassword' : 'http://localhost:8080/api/v1/users/updateMe';

    fetch(url, {
        method: 'PATCH',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then( data => {
        console.log(data);
        if(data.status === 'success' || data.status === 'successful'){
            alert('Update successful!');
            location.reload(true);
        }

        if(data.status === 'success' || data.status === 'successful'){
            alert('Update successful!');
            location.reload(true);
        }
    })
    .then( err => alert(err.message) );
}


// update email and name
document.querySelector('.form-user-data').addEventListener('submit', e => {
    e.preventDefault();

    const name = document.querySelector('#name').value;
    const email = document.querySelector('#email').value;

    const data = {
        name,
        email
    };

    updateSetting(data, "data");
    
})


// update password
document.querySelector('.form-user-password').addEventListener('submit', async e => {
    e.preventDefault();

    document.querySelector('.btn--save-password').textContent = 'processing...';

    const currentPassword = document.querySelector('#password-current').value;
    const password = document.querySelector('#password').value;
    const passwordConfirm = document.querySelector('#password-confirm').value;

    const data = {
        currentPassword,
        password,
        passwordConfirm
    };

    await updateSetting(data, "password");

    document.querySelector('.btn--save-password').textContent = 'Save password';

    document.querySelector('#password-current').value = '';
    document.querySelector('#password').value = '';
    document.querySelector('#password-confirm').value = '';
    
})