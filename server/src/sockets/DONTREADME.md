# Core concept for Server-Side Socket

- Client sends packets of strings, along with timestamps, video url and accessToken in auth.
- Validate accessToken, if not valid, reject the request and ask the user to provide accessToken again.
- Validation to the string (trim, cleanup etc)
- Add the string to the DB in the lecture using the video base url as identifier, along with timestamps.
- After DB query is successfull, emit the changes to all the clients in the room (by username) except the original sender.
- After the emission is done, send an acknowledgement to the original sender that the message was sent successfully, which prompts the packet of string to be deleted from the localStorage of the user.
- The cycle repeats again.

# Client side Socket (extension)

- Send packets of string in regular basis to the server using socket, along with accessToken.
- On failed accessToken, hit the end-poinnt, '/refresh' to generate a new accessToken using the refreshToken stored in the cookie, if still fails than log back in again else again send the packets of string to the server, along with the new accessToken.
- On receiving success from the server, delete that particular packet of string from the localStorage.

# Client side Socket (app)

- Fetch all the existing string for that particular lecture and render on the page.
- Send accessToken to the server.
- On validaton, server joins the user to a room using the username as identifier.
- On invalidation, server asks the user to provide accessToken again, same process as above.
- On succesfull validation, keep recieving the packet of string from the server, and display on the page.

# Events to be captured in the Server by Socket

- 'connection' - When a client connects to the server
- 'packet' - When a client sends a packet of string
- 'disconnect' - When a client disconnects from the server

# Events to be emitted by the Server by Socket

- 'confirmation' - When a packet of string is successfully added to the DB and emitted to other clients
- 'fPacket' - Final packet after validation sent to the clients in the room
- 'invalidToken' - When the accessToken is invalid

# Events to be captured by the Client by Socket

- 'invalidToken' - Hit the '/refresh' to generate a new accessToken and again emit 'packet' event if successful
- 'confirmation' - When the server confirms that the packet of string is successfully added to the
- 'fPacket' - When the server emits a new packet of string to be added to the page


# Events to be emitted by the Client by Socket

- 'packet' - When a client sends a packet of string

# Middlewares

- verifyAccessToken - To verify the accessToken sent by the client (do at connection itself, if not, emit inValidToken event and disconnect the socket)

# Future of LiNo

## MCP Implementation (sounds cool, that's it)

- AI will itself consume the packets of string from newly added DB entries and refine it and update the DB entry. 
- It can also make a summary from it and also form important topics/flow of topics from it and add all of it into the DB by itself.
- User will see 'Refining...' on the frontend if the AI is doing its work.
- We can use multiple AI models to do the work, one for refining, one for summarizing and one for important topics/flow of topics.
- We can use a queue system to manage the load on the AI models, so that we don't overload them and also to ensure that the packets of string are processed in the order they are received.

## Redis caching for frequent DB queries like fetching public lectures information