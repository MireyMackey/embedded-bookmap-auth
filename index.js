import { createIframe, BookmapAuthData, NoAuthData } from './lib.js';

document.getElementById('createUserButton').addEventListener('click', createUser);
document.getElementById('fetchTokenButton').addEventListener('click', getToken);
document.getElementById('createIframeButton').addEventListener('click', createNewIframe);

let bookmapToken = '';
const authenticationKey = 'bGltZTE.H7qfudHCWxgnt5Rr8Gni';
const authenticationServer = 'https://test.x-bookmap.com';

async function createUser() {
  const resultDiv = document.getElementById('userCreationResult');

  const userIdInput = document.getElementById('userId');
  const userId = userIdInput.value.trim();
  if (userId === '') {
    resultDiv.textContent = 'Please enter a user ID first.';
    return;
  }

  const response = await fetch(authenticationServer + '/api/v1/users/with-defaults', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      'accept': '*/*',
      'API-Key': authenticationKey
    },
    body: JSON.stringify({
      userId: userId,
      email: userId + '@example.com',
      firstName: 'Embed',
      lastName: 'Example',
      defaultAgreement: {
        address: {
          street: "string",
          city: "string",
          region: "string",
          postalCode: "string",
          countryCode: "string"
        },
        "proStatus": true
      }
    })
  })

  if (response.status !== 201) {
    resultDiv.textContent = `HTTP error. status: ${response.status};`;
  } else {
    const text = await response.text();
    const json = JSON.parse(text);
    resultDiv.textContent = JSON.stringify(json, null, 3);
  }
}

async function getToken() {
  const resultDiv = document.getElementById('tokenFetchResult');

  const userIdInput = document.getElementById('userId');
  const userId = userIdInput.value.trim();
  if (userId === '') {
    resultDiv.textContent = 'Please enter a user ID first.';
    return;
  }

  try {
    resultDiv.textContent = 'Sending request...';

    const response = await fetch(authenticationServer + '/api/v1/auth/token', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'accept': '*/*',
        'API-Key': authenticationKey
      },
      body: JSON.stringify({
        originalUserId: userId
      })
    })

    if (!response.ok) {
      resultDiv.textContent = `HTTP error. status: ${response.status}`;
      return;
    }
    bookmapToken = await response.text();
    resultDiv.textContent = bookmapToken;
  } catch (error) {
    resultDiv.textContent = `Error: ${error.message}`;
  }
}

async function createNewIframe() {
  const resultDiv = document.getElementById('iframeCreationResult');
  resultDiv.textContent = 'Processing';

  let authData;
  if (!bookmapToken) {
    resultDiv.textContent = 'Starting without a token. ';
    authData = new NoAuthData()
  } else {
    resultDiv.textContent = 'Starting with a token. ';
    authData = new BookmapAuthData(bookmapToken);
  }

  const bmmp = createIframe({
    url: "https://embed.web.bookmap.com/",
    authData: authData,
  })
  const iframeDiv = document.getElementById('BMMP');
  while (iframeDiv.firstChild) {
    iframeDiv.removeChild(iframeDiv.firstChild);
  }
  iframeDiv.append(bmmp);

  resultDiv.textContent += 'Iframe created.';
}
