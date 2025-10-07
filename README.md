# MNEE SDK API Wrapper

MNEE SDK API Wrapper is a Node.js + Express server that wraps the official [MNEE-SDK](https://www.npmjs.com/package/@mnee/ts-sdk) and exposes RESTful endpoints for easy integration. It provides all major SDK functionalities including Balance, UTXOs, Transactions, and Wallet Management.

For complete MNEE documentation and API reference, visit [https://docs.mnee.io](https://docs.mnee.io).

## Instalation

Instructions on how to get a copy of the project and running on your local machine.

### Prerequisites:
Before running the project, make sure the following tools are installed on your system.

### Install Node.js (v18 or higher) & npm.

Windows:
```bash
# Download and install from official site
https://nodejs.org/en/download/
```
macOS:
```bash
# Using Homebrew
brew install node
```
Linux (Ubuntu):
```bash
sudo apt update
sudo apt install -y nodejs npm
```

### Local Setup Guide:
Clone the repository and install dependencies:
```bash
https://github.com/mnee-xyz/mnee-sdk-docker.git
cd mnee-sdk-docker
npm install
```

### Environment Setup:

Create a .env file in the root directory and add the following environment variables:
```bash
PORT=<your-port>
MNEE_ENV='sandbox'
MNEE_API_URL=https://sandbox-proxy-api.mnee.net
MNEE_API_KEY=54f1fd1688ba66a58a67675b82feb93e
```
After setting up the environment file, start the server with:
```bash
node server.js 
# or
npm run start
```
Once the server is running, you can access the API Swagger documentation at:
```
http://localhost:<your-port>/api-docs
```
Use this Swagger UI to explore available endpoints, view request/response schemas, and test API calls directly.

### Docker Setup:
Run the application using Docker:
```bash
docker-compose up --build
```

## Endpoints

Get the balance for a given address:
```bash
curl "http://<YOUR_SERVER_URL>/api/balance/your-address"
```
Get the balances for multiple addresses:
```bash
curl "http://<YOUR_SERVER_URL>/api/balance?addresses=your-address1,your-address2"
```
Get the UTXOs for a given address:
```bash
curl "http://<YOUR_SERVER_URL>/api/utxos/your-address"
```
Get the UTXOs for a given address that have enough balance to cover the total atomic amount:
```bash
curl "http://<YOUR_SERVER_URL>/api/utxos/address/enough?amount=.01"
```
Get all UTXOs for a given address:
```bash
curl "http://<YOUR_SERVER_URL>/api/utxos/your-address/all"
```
the recent transaction history for a given address with pagination, limit & order:
```bash
 curl "http://<YOUR_SERVER_URL>/api/transaction/your-address?fromScore=0&limit=10&order=desc"
```
Get the recent transaction histories for multiple addresses:
```bash
curl -X POST http://<YOUR_SERVER_URL>/api/transaction/histories \
-H "Content-Type: application/json" \
-d '{
  "addresses": [
    { "address": "your-address1", "fromScore": 0, "limit": 10 },
    { "address": "your-address2", "limit": 5 }
  ]
}'

```
Get Satus of transaction through ticket ID:
```bash
curl "http://<YOUR_SERVER_URL>/api/transaction/status/ticketID"
```
Transfer the specified MNEE tokens using the provided WIF key:
```bash
curl -X POST "http://<YOUR_SERVER_URL>/api/transaction/transfer" \
-H "Content-Type: application/json" \
-d '{
  "request": [
    { "address": "receiver-address", "amount": 0.1 }
  ],
  "wif": "your-private key in WIF format",
  "transferOptions": {
    "callbackUrl": "your-custom callback",
    "broadcast": true
  }
}'
```
Transfer MNEE tokens from multiple source UTXOs with different private keys:
```bash
curl -X POST "http://<YOUR_SERVER_URL>/api/transaction/transfer-multi" \
-H "Content-Type: application/json" \
-d '{
  "options": {
    "inputs": [
      { 
        "txid": "the transaction ID of the UTXO you want to spend", 
        "vout": 0,  // The index of the specific output in the transaction
        "wif": "the private key in WIF format controlling the UTXO" 
      }
    ],
    "recipients": [
      { 
        "address": "receiver-address", 
        "amount": 0.1
      }
    ],
    "changeAddress": "your-address to receive any remaining balance"
  },
  "transferOptions": {
    "callbackUrl": "your-custom callbackurl",
    "broadcast": true
  }
}'
```
POST submit raw transaction Hex
```bash
curl -X POST "http://<YOUR_SERVER_URL>/api/transaction/submit-rawtx" \
-H "Content-Type: application/json" \
-d '{
  "rawTxHex": "The raw transaction hex string to submit",
  "transferOptions": {
    "callbackUrl": "your-custom callbackurl",
    "broadcast": true
  }
}'
```
Parse By Txid:
```bash
curl "http://<YOUR_SERVER_URL>/api/parse/txid?includeRaw=true"
```
Parse from rawTxHex:
```bash
curl -X POST "http://<YOUR_SERVER_URL>/api/parse/from-raw" \
-H "Content-Type: application/json" \
-d '{
  "rawTxHex": "your TxHex",
  "includeRaw": true
}'
```
Parse Inscription:
```bash
curl -X POST "http://<YOUR_SERVER_URL>/api/parse/inscription" \
-H "Content-Type: application/json" \
-d '{
  "script": "your-script-string"
}'

```
Parse Cosigner Scripts:
```bash
curl -X POST "http://<YOUR_SERVER_URL>/api/parse/cosigner-scripts" \
-H "Content-Type: application/json" \
-d '{
  "scripts": ["script1", "script2"]
}'

```
Get MNEE Configuration:
```bash
curl "http://<YOUR_SERVER_URL>/api/config"
```
Validate MNEE Transaction:
```bash
curl -X POST "http://<YOUR_SERVER_URL>/api/config/validate" \
-H "Content-Type: application/json" \
-d '{
  "rawTxHex": "0100000001...",
  "request": [
    { "address": "recipient-address", "amount": 100 }
  ]
}'
```
Convert to Atomic Amount:
```bash
curl -X POST "http://<YOUR_SERVER_URL>/api/config/to-atomic" \
-H "Content-Type: application/json" \
-d '{
  "amount": 1.5
}'
```
Convert from Atomic Amount:
```bash
curl -X POST "http://<YOUR_SERVER_URL>/api/config/from-atomic" \
-H "Content-Type: application/json" \
-d '{
  "atomicAmount": 150000
}'
```

## Unsupported SDK Features

The following MNEE SDK features are **not currently supported** in this API wrapper:

### HDWallet
The SDK's `HDWallet` class provides hierarchical deterministic wallet functionality with methods like `deriveAddress(index)` and `getPrivateKey(index)`. This requires maintaining stateful instances which doesn't fit the stateless REST API pattern.

**Recommendation:** Use the SDK directly in your application for HDWallet operations.

### Batch Operations
The SDK's `batch()` method returns a Batch instance for performing multiple operations efficiently. This also requires maintaining state between requests.

**Recommendation:** Use the SDK directly for batch operations, or make individual API calls for each operation.

## License
MIT