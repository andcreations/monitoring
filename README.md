# Monitoring

Monitoring is a small server which monitors connections to other servers and notifies uses in case of a broken connection. The notifications are sent over Telegram and therefore a bot must be created. See below for more information.

## HTTP heartbeat endpoint

Currently, it supports only HTTP connection checking in a heartbeat manner. That is, an HTTP GET request is sent to a remote server. If the connection cannot be established or the response is not `2xx`, then such a situation is treated as an error.

## Building

The server is built with the following commands:

```bash
npm install
npm run build
```

## Configuration

The configuration is kept in a YAML file. The path to the file is given through an environment variable `MONITORING_CFG_FILE`. The file is divided into 3 sections:
- `telegram` provides telegram configuration:
  - `token` bot token,
  - `messageRetryDelay` delay in milliseconds after which the server retries to send Telegram messages which failed to sent,
  - `updatesInterval` milliseconds between getting updates (messages from users) from the Telegram server,
  - `allowedUser` list of names of users allowed to interact with the server (Telegram bot),
- `properties`:
  - `file` path to a file with properties stored by the server (this file shouldn't be edited manually),
- `endpoints` list of endpoints to monitor, each endpoint has the following configuration:
  - `name` unique endpoint name,
  - `type` endpoint type (must be `http-heartbeat`),
  - `cfg` endpoint configuration specific to the type.

### HTTP heartbeat endpoint configuration

The configuration of an HTTP heartbeat endpoint takes 2 values:
- `url` to which to make requests,
- `interval` time between requests.

### Example configuration

Below is an example configuration with just one user allowed `johnny` and a single HTTP endpoint `Example HTTP server` to be monitored.

```yaml
telegram:
  token: 123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
  messageRetryDelay: 4000
  updatesInterval: 1000
  allowedUsers: [johnny]

properties:
  file: properties.json

endpoints:
  - name: Example HTTP server
    type: http-heartbeat
    cfg:
      url: http://192.168.1.1:8080/api/v1/status/ping
      interval: 1600
```

## Telegram

Users communicate with the monitoring server through a Telegram bot. In order to get notifications from the server, a user must send a command to the server. This way the server knows the identifier of the user's chat to which pass messages. The welcome command is the Telegram bot welcome command `/start`.

Another command is `/endpoints` which lists endpoints with their statuses.

## Starting and stopping

The server comes with two scripts to start the server in background and stop it. The scripts are `start.sh` and `stop.sh` in the directory `bin`. The file with the identifier of the running process is kept in the file `.pid` in the server directory.