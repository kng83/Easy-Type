
//Problem z @types/request-promise:
- "@types/bluebird": "^3.5.19" zawieraja odniesienie do map ,ktore jest w ES6 (mozna zmienici tsconfig.json target:ES6 i module:commonjs )

-rozwiazanie to dodanie to tsconfig.json        
 "lib": [
            "dom",
            "es2015"
          ]
    },

//Siemens s7-1200 response problem:
- Request to Siemens s7-1200 is not giving a normal respone : CE<parent>...</parent>0. 

/^\s+|\s+$/g means:
^    // match the beginning of the string
\s+  // match one or more whitespace characters
|    // OR if the previous expression does not match (i.e. alternation)
\s+  // match one or more whitespace characters
$    // match the end of the string


// list of codes
100 Continue
101 Switching Protocols

200 OK
201 Created
202 Accepted
203 Non-Authoritative Information (since HTTP/1.1)
204 No Content
205 Reset Content
206 Partial Content (RFC 7233)

user.[32]

400 Bad Request
401 Unauthorized
402 Payment Required
403 Forbidden
404 Not Found
