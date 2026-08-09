const payload = {
   "fullName":"abcde",
    "email":"jatinag3254@gmail.com",
    "role":"admin",
    "password":"abcdeabcde",
    "confirmPassword": "abcdeabcde"
};

fetch('http://localhost:3000/api/v1/auth/send-mail-auth', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
})
.then(async res => {
    console.log('Status:', res.status);
    const text = await res.text();
    console.log('Response Body:', text);
})
.catch(err => {
    console.error('Error:', err);
});
