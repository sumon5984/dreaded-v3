/*   Fortunatus :v

What's The Point Of This Code ? */

const ownerMiddleware = require('../../Middleware/ownerMiddleware'); 


module.exports = async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, Owner } = context;

})

}