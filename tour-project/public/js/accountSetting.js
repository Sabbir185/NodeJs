
const updateSetting = (data, type) => {

    const url = type === 'password' ? '/api/v1/users/updateMyPassword' : '/api/v1/users/updateMe';

    const option = type === 'password' ? {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    }
        :
        {
            method: 'PATCH',
            body: data,
        }

    fetch(url, option)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if (data.status === 'success' || data.status === 'successful') {
                alert('Update successful!');
                location.reload(true);
            }

        })
        .catch(err => alert(err.message));
}


// update email and name
document.querySelector('.form-user-data').addEventListener('submit', e => {
    e.preventDefault();

    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    updateSetting(form, "data");

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