const Koa = require('koa');
const Router = require('koa-router');
const app = new Koa();
const bodyParser = require('koa-bodyparser');
const logger = require('koa-logger')
// user          : "SYSTEM",
// password      : "Abcd1234",
// connectString : "localhost:1523/orcl4"
const router = Router();
app.use(logger())
app.use(bodyParser());

app.use(async (ctx, next) => {
  ctx.set("Access-Control-Allow-Origin", "*");
	ctx.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Content-Disposition");
	ctx.set("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
	ctx.set("Access-Control-Allow-Credentials", true);
	await next()
});

const controller = require('./controller')

/* ******************* categories ********************** */
router.get('/all-category', controller.allCategories)
router.get('/category-pagination', controller.categoryPagination)
router.get('/category-count', controller.categoryCount)
router.get('/category', controller.categoryById)
router.post('/category', controller.categoryAdd)
router.put('/category/:id', controller.categoryUpdate)
router.delete('/category/:id', controller.categoryDelete)

/* ******************* items ********************** */
router.get('/items-pagination', controller.itemsPagination)
router.get('/items-count', controller.itemsCount)
router.post('/item', controller.itemAdd)


app.use(router.routes())
app.use(router.allowedMethods())

const port = 3000
app.listen(port, () => {
  console.log('Start http://localhost:' + port)
});