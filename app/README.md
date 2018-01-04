# Development Tips

## Start the Rest API w/o security

Steps:
 1. Start PostgreSQL from docker

        $ docker run -d --rm -p 5432:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=syndesis postgres

 2. Start Syndesis backend (I run io.syndesis.runtime.Application from IDE), with JVM options:
 
         -Dendpoints.test_support.enabled=true -Ddeployment.load-demo-data=false -Dencrypt.key=hello

 3. Install tinyproxy
        
        $ brew install tinyproxy --with-reverse

    Start [tinyproxy](https://tinyproxy.github.io/) from a directory that has `tinyproxy.conf` (below)

        $ tinyproxy -d -c tinyproxy.conf

 4. Modify the `$SYNDESIS/app/ui/src/config.json` (sample config is in the [repo](https://github.com/syndesisio/syndesis/blob/master/app/ui/src/config.json.example))
    the `apiEndpoint` needs to point to tinyproxy (`http://localhost:9090`):
    
        "apiBase": "http://localhost:9090"
     
     or

        "apiEndpoint": "http://localhost:9090/api/v1",
        "mapperEndpoint": "http://localhost:9090/mapper/v1",

  5. Start the UI with from `$SYNDESIS/app/ui` (You may need to `npm rebuild node-sass`)

         $ yarn start

  6. Open the browser [to https://localhost:4200](https://localhost:4200) use Chrome and Developer Tools
     
     If that doesn't load any resources because the calls to the backend are http, then switch the UI to http as well using

     "start": "yarn ng serve --ssl false
  
     in app/ui/package.json

  7. Place a `debugger;` statement in a `.ts` file as a first breakpoint to have somewhere to start debugging
  

```
Port 9090
ReverseOnly Yes
ReversePath "/" "http://localhost:8080/"
AddHeader "X-Forwarded-User" "developer"
AddHeader "X-Forwarded-Access-Token" "dummy-token"

MaxClients 100
MinSpareServers 5
MaxSpareServers 20
StartServers 10
MaxRequestsPerChild 0

PidFile "tinyproxy.pid"
LogFile "tinyproxy.log"
```
