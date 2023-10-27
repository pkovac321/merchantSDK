# Introduction
This is a sample application developed using Node.js and the [Express.js](https://expressjs.com/) framework. It serves as a demonstration of how to integrate with a Card Gateway for a sample customer.

The application integrates with a [Primer widget](https://primer.io/docs/sdk/), which can be customised based on the styling guidelines available in the checkout documentation.

# Prerequisites

Before running this sample application, you must obtain an `mAccount` to gain access to the API Gateway.

You can acquire an `mAccount` through Monoova's Developer Portal (https://developer.monoova.com/) or by contacting [Monoova Support directly](https://www.monoova.com/contact).

You will also need to install Node.js to run the sample application.

# Getting Started

1. Clone the Repo.
2. Navigate to your `config/sandbox.json` and make any necessary edits to the configuration settings.
  ```json
  {
    "Mov_username": "your mAccount number (e.g., 62************)",
    "Mov_password": "your password (e.g., 67A***-****-****-*****-*****)",
    "APIM_Token_URL": "Monoova Supplied URL to generate Bearer token to access CC services",
    "Client_Session_token_url": "Monoova Provided Url to create a Client session."
  }
  ```

# Running

Finally, you can run the npm commands (you will need npm installed):
* npm install
* npm start

This will run a local instance of the code.

# Application Overview

This Node.js Express application serves up a `checkout.html` page which includes a form for customer details. Upon submission, the form payload is sent to the `/token` endpoint.

The `/token` endpoint handles authentication with Monoova using credentials from the configuration file, returning a bearer token. This bearer token is then used in subsequent requests to create a client session.

A test credit card can be used with the following details:
- **Number**: 4111111111111111
- **Expiration**: 12/31
- **CCV**: 111
- **Name**: Any name

# Steps to rebuild the sample app

1. Add primer scripts in your application (from `checkout.html`)
2. Generate the bearer token using the Token URL using mAccount number as username & Api-key as password, with the Basic auth scheme.
3. Call `Client_Session_token_url` using the Bearer token in the header (generated earlier) with the Customer details in the body (as captured in `Checkout.html` in Demo).

## Customer details

The customer details are shown below and will be serialised and sent as a body to generate a Client Session via "Client_Session_token_url":

```json
{
  "customer": {
    "emailAddress": "",
    "mobileNumber": " ",
    "billingAddress": {
      "firstName": " ",
      "lastName": " ",
      "postalCode": " ",
      "street": [""],
      "countryCode": " ",
      "suburb": " ",
      "state": " "
    }
  },
  "paymentDetails": {
    "cardType": " ",
    "description": "sample token create",
    "saveOnSuccess": false
  },
  "amount": {
    "currencyAmount": ""
  }
}
```

## Client.js

This script initiates a server request to the `/token` endpoint. It utilises the provided JSON body for the request. Upon successfully retrieving the token, it invokes the Universal Checkout process.

The client session and any UI customisation options are passed along during this step.

## Server.js

This file is the backend interface, handling all API calls to Monoova. The details of each specific call are abstracted within this file.

- The application serves a `checkout.html` page that includes a form to capture customer details.
- When the form is submitted, the form payload is sent to the `/token` endpoint.
- The `/token` endpoint authenticates with Monoova using credentials provided from the configuration file, returning a bearer token.
- The bearer token is used in the subsequent request to create a client session.

## Style customisation

* Edit `Checkout.html` and `style.css` to apply Host themes.
* For Card Widget UI, modify CSS using `#Checkout-container` ID.
* Customise the checkout styles using [Primer Documentation](https://primer.io/docs/payments/universal-checkout/drop-in/customize-checkout/web).
