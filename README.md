# Ticketing
A ticketing application utilizing microservices architecture from Udemy's Microservices With Node JS and React Course.
In this project, I learned how to build a microservices application using React with Next JS on the front end, and Typescript Node services utilizing Mongo Database, and Nats Streaming Server messaging service on the back end.

<img src="architecture.png" width="800" height="600" />

## Application Functionality
- Users can list a ticket for sale
- Other users can purchase the ticket
- Any user can sell or purchase tickets
- During purchase the user has 60 seconds to complete the transaction during which time the ticket is locked for editing or purchase by other users

## Technical Considerations

After building a simple React & Node microservice application in Javascript at the beginning of the course, the following issues arose during development. These issues are addressed in this project with the following solutions
1. *Lots of duplicated code* -> **Build a common module as an NPM module with code shared between services**
2. *Difficult to understand the flow of events between services* -> **Define all the events in the common module**
3. *No help from IDE with identifying message properties* -> **Write the services using Typescript**
4. *Difficult to test event flows* -> **Write tests using Jest and mock the Nat Streaming Server dependency**
5. *Running Docker Desktop and Kubernetes might cause lagging on computer* -> **Run a k8s cluster in Google Cloud and develop almost as quickly as local**
6. *Concurrency issues not addressed* -> **Utilize Nats Streaming Server to ensure message receipt is acknowledged and version messages being processed by services**

## Getting Started
Clone the repository to your local machine by running the following command in a terminal window or command prompt from the location you wish to copy the folder

`https://github.com/kevinjdev/Ticketing.git`

### Prerequisites
* ...
* ...
* ...

### How To Run
... 
```
mkdir build
cd build
cmake ..
make
./environment
```
### Explanation of the Running Program

## Nanodegree Completion Certificate
<img src="microservices-kevin-jaeger.jpg" width="600" height="400" />
