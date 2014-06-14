## server.js

Main starting point for the app. Start it like

`node --harmony server.js` or
`nodemon --harmony -w server.js server.js` or simply
`gulp`, which could be the preferred option.

### routes
local resource      | route/mount point  | description
:------------------ | :----------------- | :-----------------------------------
./public            | /                  | public/static files
./bower\_components | /bower\_components | bower assets
./views             | /templates         | jade templates in ./views/templates
./routes/api        | /api               | api routes to database, serving json
./routes            | /                  | home. serves ./views/index.jade


### database connection
`pg://postgres:liveandgov@localhost[:3333]/liveandgov`

In development mode make sure to establish a ssh tunnel to the server and specify the correct port (here: 3333) in the connection string. If you want the ssh tunnel to be quiet and detached, add `-Nf` as options.

```
ssh -L 3333:141.26.69.238:5432 rene@141.26.69.238
psql -h localhost -p 3333 -U postgres liveandgov
```

### node port
mode        | port
----------- | ----
development | 3001
production  | 4001

## routes/index.js





### Rendering jade templates

Serving templates via the api seems to be more easily configurable.









# Dart

1. More structured.
2. More scalable.
3. Faster.
4. Hi-Tech, sexy and interesting.
5. Would render Node.js obsolete.

# Go

1. Write the backend in Go.
2. Best performance.
3. Beautiful language.
4. Quote: "It's a fast, statically typed, compiled language that feels like a dynamically typed, interpreted language."

# Backend

1. Access PostgreSQL database.
2. Provide RESTful API.

# TODO: Refactor

1. s/svg/canvas (canvas is faster, isn't it?)
2. any use for websockets?
3. -s/express/koa-
4. create -polymer- react elementsi
5. use html5 local storage
6. make services more modular
7. completely separate back and front end? (e.g. don't render views on the server)

# TODO: Fix Me!

1. Fix bad PostgreSQL query performance.
2. Fix bad d3 minimap performance.
3. Write tests!

# TODO: Write tests!

1. Test if sensor data merge function returns an correctly merged array.
2. Handle all cases of corrupt data (missing har tags, wrong timestamps/duration, missing sensor data, zero size trips).
