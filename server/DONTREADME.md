- Add utility functions for asyncHandler, apiResponse, and apiError.
- here, all the errors are thrown using the ApiError class which is captured inside the asyncHandler and passed thorugh next to the global Error Handler middleware, which logs it in the console and also returns a response back to the client
- I will also maintain a HTTP_Codes file for passing codes directly from there
- Also, now I will handle errors by throwing all of them by the utility apiError and then handling them in the errorHandler middleware, which will return back the response to the client

## Features of the Server
- Add utility functions for every repetead functionality.
- Add a global error handler middleware.
- Add a HTTP_CODE file
- Add a Rate Limiter to all the routes