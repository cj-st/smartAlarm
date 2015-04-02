JavaScript SDK v2.1.0

This zip package contains everything needed to get started with the TomTom JavaScript SDK.
The TomTom JavaScript SDK allows web developers to build web based mapping applications using TomTom's
powerful suite of API functions which include mapping, routing, geocoding and traffic.
This readme describes what each part of the package is used for.

===============
== Examples ===
===============

Before any of the examples will work, you need to enter your API key into the apikey.js file in the examples folder.
If you do not have an API key, you can sign up for an account and request a key at http://developer.tomtom.com/.

===============
=== Folders ===
===============

== css ==
Contains the stylesheets needed to make the map display properly.
                        		
== documentation ==
The JavaScript documentation which describes each class in full detail.
                        		
== examples ==
Examples that show of some of the features of the SDK.
									
== images ==
Contains all of the images used by the SDK.
                        		
== js ==
Contains all JavaScript files which are needed to use the SDK.

=============
=== Files ===
=============
                        		
== js/tomtom.map.js ==
The main JavaScript file which provides all mapping functionality.

== js/tomtom.services.js ==
The JavaScript file used to access services WITHOUT mapping functionality.  If you are already including
tomtom.map.js, there is no need to include this file.  This file is only needed if you would like
to use the services without using map display.
									
== js/tomtom.controls.js ==
Contains classes that can be used to create advanced controls that compliment the map. Currently this file includes AutoComplete, RouteControl, TrafficIncidentListControl, FindLocationControl
and the RoutePlannerControl.
                        		
== js/tomtom.i18n.js ==
Contains all i18n strings for all supported langauges.
							
== js/leaflet.js ==
The current version of leaflet, which is required to use the TomTom JavaScript SDK.

== Getting Started.pdf ==
This guide will get you up and running on the TomTom JavaScript SDK.

== Migrating from 1.x.pdf ==
A guide to updating your code for version 2.0 of the SDK.