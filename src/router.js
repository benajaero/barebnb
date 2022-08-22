import Router from 'koa-router';

import { doesUserExist, addNewUser  } from './sql-wrapper';

const router = new Router();

router.post('/auth/register', async ctx => {
    const { username, email, first_name, last_name, password } = ctx.request.body;

    const userExists = await doesUserExist(username);
    
    if (!userExists) {
        const token = await addNewUser(username, email, first_name, last_name, password);

        ctx.body = { token: token }
    }
});

router.post('/auth/login', ctx => {

})

router.get('/get-all-places', ctx => {

});

router.get('/get-place', ctx => {

});

router.put('/update-rating', ctx => {

});

router.get('/get-availability', ctx => {

});

router.post('/add-availability', ctx => {

});

router.delete('/remove-availability', ctx => {

});

router.get('/get-notifications', ctx => {

});

router.post('/read-notification', ctx => {

});

router.get('/get-photos', ctx => {

});

router.get('/get-photo', ctx => {

});

router.post('/add-photo', ctx => {

});

router.delete('/delete-photo', ctx => {

});

router.get('/create-database', ctx => {

});

export default router;
