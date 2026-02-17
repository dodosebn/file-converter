const http = require('http');

function request(path, method, body) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({ status: res.statusCode, body: data });
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function test() {
  const email = 'test' + Date.now() + '@example.com';
  const password = 'Password@123';

  console.log('1. Attempting Signup...');
  try {
    const signupRes = await request('/auth/signup', 'POST', {
      name: 'Test User',
      email: email,
      password: password
    });
    console.log('Signup Status:', signupRes.status);
    console.log('Signup Body:', signupRes.body);

    if (signupRes.status === 201) {
       console.log('\n2. Attempting Login with NEW user...');
       const loginRes = await request('/auth/login', 'POST', {
         email: email,
         password: password
       });
       console.log('Login Status:', loginRes.status);
       console.log('Login Response:', loginRes.body);
    } else {
        console.log('Signup failed, skipping login test.');
    }

  } catch (err) {
      console.error('Error during test:', err);
  }
}

test();
