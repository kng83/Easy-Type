import express from "express";
const path = require('path');

const app = express()
app.use(express.static(path.join(__dirname, './public')));
console.log(__dirname);

app.get('/countdown', function(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  })
  countdown(res, 10)
})

app.get('*', function(req, res){
    res.sendFile(path.join(__dirname + './public/index.html'));
  });


function countdown(res, count) {
  res.write("data: " + count + "\n\n")
  if (count)
    setTimeout(() => countdown(res, count-1), 1000)
  else
    res.end()
}

app.listen(3000, () => console.log('SSE app listening on port 3000!'))