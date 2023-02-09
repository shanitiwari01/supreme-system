In this project architecture, we used workspace to share common code between node.js, react.js, and react native.

1. Node.js

we have divided node.js into four parts.

- ServicesLayer Project
The ServicesLayer is a basic node js project which handles all APIs ( route ), requests, and responses.

- ServiceBusinessLayer
All backend Logic will manage in ServiceBusinessLayer.

- ServiceDataLayer
All the database-related operations will perform in ServiceDataLayer.

- ExternalServices
The ExternalServices is for managing all third parties apis.

2. React Native

For react native application, we are managing Three Projects.

- SupremeSystemMobileClient
Basic React Native Application responsible to handle UI Route and UI components.

- MobileBusinessLayer
All Logic in a mobile application will handle here like API calls, Data Filters.

- MobileDataLayer
The MobileDataLayer is for SQLite operation so our application support offline.

3. React.js

For the website, we have the WebClient project responsible to handle UI Route and UI components.

4. Models and DTO

For the use of DTO ( Data Transfer objects ) and models, we have separate projects DataModels.

5. Utility

To manage all constants and share in all projects and basic utility functionality.

github.com/shanitiwari01/supreme-system

Plus Point: In this sample project I have used Detox + jest to test react native application.
