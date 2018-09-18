const Koa = require('Koa');
const app = new Koa();
const log = console.log;

app.use(async ctx => {
  ctx.body = 'Hello World';
});

// logger
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}`);
});

// error
app.on('error', err => {
  log('server error', err)
});

app.listen(3000);
