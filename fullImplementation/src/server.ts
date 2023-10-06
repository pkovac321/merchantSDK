import express, { Request, Response } from 'express';
import fetch from 'node-fetch';
import path from 'path';
import config from 'config';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import iso3166 from 'iso-3166-2';

import { MonoovaLoginResponse } from './models/MonoovaLoginResponse';
import { ErrorResponse } from './models/ErrorResponse';
import { CreateClientSessionTokenRequest } from './models/CreateClientSessionTokenRequest';
import { CreateClientSessionTokenResponse } from './models/CreateClientSessionTokenResponse';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/static', express.static(path.join(__dirname, 'static')));
app.use(express.static('public'));

// Environment information
console.log('NODE_ENV:', config.util.getEnv('NODE_ENV'));

// Routes
app.get('/', (req: Request, res: Response) => res.sendFile(path.join(__dirname, 'static', 'checkout.html')));

// checkout.html form submits to this endpoint
app.post('/token', async (req: Request, res: Response) => {
  try {

    // begin login to monoova
    const monoovaLoginUrl: string = config.get('Monoova_Token_url');
    const userName: string = config.get('Mov_username');
    const password: string = config.get('Mov_password');
    const credentials: string = Buffer.from(`${userName}:${password}`).toString('base64');
    const basicAuthHeaderValue: string = `Basic ${credentials}`;
    const loginResponse = await fetch(monoovaLoginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': basicAuthHeaderValue
      }
    });

    if (!loginResponse.ok) {
      const errorMsg: string = `Error logging into monoova: ${loginResponse.statusText}`;
      console.error(errorMsg);
      return res.status(400).json({ error: errorMsg });
    }
    const monoovaLoginResponse: MonoovaLoginResponse = await loginResponse.json();
    console.log('Monoova login bearer token:', monoovaLoginResponse.token);
    // end login to monoova

    // begin create client session token
    const createClientSessionApiUrl: string = config.get('Client_Session_Token_url');
    const createClientSessionAuthorizationHeader: string = `Bearer ${monoovaLoginResponse.token}`;

    const createClientSessionTokenRequest: CreateClientSessionTokenRequest = req.body;
    createClientSessionTokenRequest.clientTransactionUniqueReference = uuidv4();
    console.log('createClientSessionTokenRequest Request Body:');
    var requestbodyJson = JSON.stringify(createClientSessionTokenRequest);
    console.log(requestbodyJson);

    const createClientSessionResponse = await fetch(createClientSessionApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': createClientSessionAuthorizationHeader
      },
      body: requestbodyJson
    });


    const createClientSessionResponseData: CreateClientSessionTokenResponse | ErrorResponse = await createClientSessionResponse.json();
    console.log('CreateClientSessionTokenResponse:', JSON.stringify(createClientSessionResponseData, null, 2));

    if (createClientSessionResponse.status !== 200) {
      if ('errors' in createClientSessionResponseData && Array.isArray(createClientSessionResponseData.errors)) {
        const errorDetails = createClientSessionResponseData.errors.map((err: { errorMessage: string }) => err.errorMessage).join('; ');
        return res.status(400).json({ error: errorDetails });
      } else {
        return res.status(400).json({ error: 'An error occurred during client session creation, but no error details were provided.' });
      }
    }

    res.json(createClientSessionResponseData);
    // end create client session token

  } catch (error) {
    console.error('Error processing /token endpoint:', error);
    if (error instanceof Error) {
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

app.get('/api/countries', (req: Request, res: Response) => {
  res.json(iso3166.data);
});

const PORT: number = parseInt(process.env.PORT || '8080');
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));