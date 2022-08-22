import Koa from 'koa';
import parser from 'koa-bodyparser';
import cors from '@koa/cors';

const app = new Koa();
const port = 3000;

app.use(parser());
app.use(cors());

// logger

app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.get('X-Response-Time');
    console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

// x response time

app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
});

// response

app.use(async ctx => {
    ctx.body = 'Hello World';
});

app.listen(port, () => {
    console.log(`🚀 Server listening on localhost:${port}`);
});
