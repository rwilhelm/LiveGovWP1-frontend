

`DIRECTIVES <-> CONTROLLER <-> TRIP SERVICE <-> DATA FACTORY`


#### Trip.loadTrips():
1. load trip data and populate the trip table view ('/rec')

#### Trip.select():
2. user selects a trip

#### Trip.loadData():
3. load sensor data for that trip


Trip Modules
============

Trip Controller
Trip Service
Config Service (rename/merge into Trip Service)
TripTable Component
Navbar Component(?)

Data Module
===========

Data Factory

Components + Directives
=======================

Every root React Component has a Angular Directive by which it is invoced

TripTable

Navbar
Navbar Controller (is it possible to get rid of it?)






Data Factory
============

- stateless
- functional

Responsibilities:
-----------------

1. Fetch data via API.

2. Prepare the data.

4. Validate the data.

3. Return a promise about the data.

Trip Service
============

- stateful
- imperative

Responsibilities:
-----------------

1. Call Data Factory and store resolved data in our big fat trip object.

2. Provides persistent trip object.

Trip Controller
===============

1. Handles user input.

2. Populates $scope with data from Trip Service.

3. Provides $scope to templates.

4. Reacts on bound functions in templates/directives.
