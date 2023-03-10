const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  Product.findAll().then((products) => {
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "All Products",
      path: "/products",
    });
  });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findAll({ where: { id: prodId } }).then((product) => {
    res.render("shop/product-detail", {
      product: product[0],
      pageTitle: product[0].title,
      path: "/products",
    });
  });
};

exports.getIndex = (req, res, next) => {
  Product.findAll().then((product) => {
    res.render("shop/index", {
      prods: product,
      pageTitle: "Shop",
      path: "/",
    });
  });
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts().then((products) => {
        res.render("shop/cart", {
          path: "/cart",
          pageTitle: "Your Cart",
          products: products,
        });
      });
    })
    .catch(err => console.log(err));

  // Cart.getCart(cart => {
  //   Product.fetchAll(products => {
  //     const cartProducts = [];
  //     for (product of products) {
  //       const cartProductData = cart.products.find(
  //         prod => prod.id === product.id
  //       );
  //       if (cartProductData) {
  //         cartProducts.push({ productData: product, qty: cartProductData.qty });
  //       }
  //     }
  //     res.render('shop/cart', {
  //       path: '/cart',
  //       pageTitle: 'Your Cart',
  //       products: cartProducts
  //     });
  //   });
  // });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }
      let newQuantity = 1;
      if (product) {

        let oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return Product.findByPk(prodId).then((product) => {
          fetchedCart.addProduct(product, {
            through: { quantity: newQuantity },
          });
        });

      }
      return Product.findByPk(prodId).then((product) => {
        fetchedCart.addProduct(product, {
          through: { quantity: newQuantity },
        });
      });
    })
    .catch((err) => console.error(err));
  res.redirect('/products')
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.getCart().then(cart => {
    return cart.getProducts({ where: { Id: prodId } })
  })
    .then((products) => { const product = (products[0]); product.cartItem.destroy() }).then(() => { res.redirect("/cart"); })
  // Product.findById(prodId, (product) => {
  //   Cart.deleteProduct(prodId, product.price);
  //   res.redirect("/cart");
  // });
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
