# DevTinder APIs

## authRouter
- POST/signup
- POST/login
- POST/logout

## profileRouter
- GET/profile/view
- PATCH/profile/update
- PATCH/profile/password

## connectionRequestRouter
- POST/request/send/interested/:userID
- POST/request/send/ignored/:userID
- POST/request/review/accepted/:requestID
- POST/request/review/rejected/:requestID

## userRouter
- GET/user/connections
- GET/user/requests
- GET/user/feed - gets the profile for other users in your platform