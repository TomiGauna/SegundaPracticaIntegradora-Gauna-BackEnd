import { Router } from "express";
import ProductManager from "../dao/MongoManagers/MongoProdManager.js";
import CartManager from "../dao/MongoManagers/MongoCartManager.js";

const router = Router();
const prodManager = new ProductManager();
const cartManager = new CartManager();

router.get('/products', async(req, res) => {
    let limit = parseInt(req.query.limit);
    let page = parseInt(req.query.page);
    let sort = req.query.sort;
    let query = req.query.query;

    let products = await prodManager.getAllProducts(limit, page, sort, query);
    let prodsToJSON = products.docs.map(prod => prod.toJSON());
    
    const separation = {
        productslpsq: products,
        prodsDocs: prodsToJSON,
        user: req.session.user
    }

    res.render ('prods', { title: 'iTech Store',
                            style: 'home.css',
                            allProds: separation.prodsDocs,
                            workedDocs: separation.productslpsq,
                            user: separation.user })
})

router.get("/carts/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cartFound = await cartManager.getCartId(cartId);

    res.render("cart", {
      title: "iTech Store",
      cartFound: cartFound,
      style: 'style.css'
    });
  } catch (error) {
    console.error("Internal Server Error: ", error);
    res.status(500).send("Fail to get products");
  };
});

router.get('/realtimeproducts', async(req, res) => {
    const products = await prodManager.getAllProducts();
    res.render('realTimeProducts', {title: 'iTech Store',
                        style: 'realtime.css', 
                        products})
})

router.get('/chat', (req, res) => {
    res.render('chat', {title: "Application's Chat",
                         style: 'css/chat.css' })
})

router.get('/login', (req, res) => {
  res.render('login', { title: 'Log In', style: 'login.css' });
})

router.get('/register', (req, res) => {
    res.render('register', { title: 'Register', style: 'register.css' });
});

router.get('/profile', (req, res) => {
  res.render('profile', { user: req.session.user, title: 'Profile' });
});

export default router