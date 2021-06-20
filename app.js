var express = require("express");
var exphbs = require("express-handlebars");
var port = process.env.PORT || 3000;
const mercadopago = require("mercadopago");
mercadopago.configure({
  access_token:
    "APP_USR-6317427424180639-042414-47e969706991d3a442922b0702a0da44-469485398",
});

var app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.use(express.static("assets"));

app.use("/assets", express.static(__dirname + "/assets"));

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/detail", function (req, res) {
  res.render("detail", req.query);
});

app.post("/create_preference", (req, res) => {
  // Crea un objeto de preferencia
  let preference = {
    items: [
      {
        title: req.body.description,
        unit_price: Number(req.body.price),
        quantity: Number(req.body.quantity),
      },
    ],
    back_urls: {
      failure: "http://localhost:8080/feedback",
      pending: "http://localhost:8080/feedback",
      success: "http://localhost:8080/feedback",
    },
    auto_return: "approved",
  };

  mercadopago.preferences
    .create(preference)
    .then(function (response) {
      // Este valor reemplazará el string "<%= global.id %>" en tu HTML
      res.json({ id: response.body.id });
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.get("/feedback", function (request, response) {
  response.json({
    Payment: request.query.payment_id,
    Status: request.query.status,
    MerchantOrder: request.query.merchant_order_id,
  });
});

app.listen(port);
