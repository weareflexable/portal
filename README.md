# services-web
Webapp for service providers to offer and manage DATs

## Routing
`/organizations/[organizationId]/services/[serviceId]` — Old routing pattern  
`/organizations/services` — New routing pattern  

**The old routing pattern** is best used when the value in the query parameter (organizationId and serviceId) are only needed in that page alone not in it's nested routes. Admitedly, it's still possible to access those query parameters in nested routes, but there's a lot of overhead to that approach, one being always having to reach for route params every time you need to use the values.  

What happens when the route changes and you still need the param values? Hence, that's the reason for proposing the new routing pattern.  

**The routing new pattern** was adopted because currently active organizations and services are being cached in local storage. Therefore, whenever those ids are needed, they could easily be accessed in the local storage.