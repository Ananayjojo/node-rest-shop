// sseConnection.js
const sseClients = [];

function sendSSEData(data) {
  sseClients.forEach(client => {
    client.res.write(`data: ${JSON.stringify(data)}\n\n`);
  });
  console.log('MFFFFF')
}

function sseMiddleware(req, res, next) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  res.sseSetup = () => {
    res.write('\n');
    sseClients.push({ res });
  };

  res.on('close', () => {
    const index = sseClients.findIndex(client => client.res === res);
    if (index !== -1) {
      sseClients.splice(index, 1);
    }
  });

  next();
}

module.exports = {
  sendSSEData,
  sseMiddleware,
};
