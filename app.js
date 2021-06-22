var express = require("express");
var exphbs = require("express-handlebars");
var port = process.env.PORT || 3000;

// SDK de Mercado Pago
const mercadopago = require("mercadopago");
// Agrega credenciales
mercadopago.configure({
  access_token:
    "APP_USR-6317427424180639-042414-47e969706991d3a442922b0702a0da44-469485398",
  integrator_id: "dev_24c65fb163bf11ea96500242ac130004",
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

app.get("/feedback", function (req, res) {
  res.render("feedback", req.query);
});

app.post("/create_preference", (req, res) => {
  let preference = {
    items: [
      {
        id: 1234,
        title: req.body.title,
        description: "Dispositivo móvil de Tienda e-commerce",
        picture_url: req.body.picture_url,
        quantity: Number(req.body.quantity),
        unit_price: Number(req.body.unit_price),
      },
    ],
    external_reference: "matiasmieres64@gmail.com",
    payer: {
      name: "Lalo",
      surname: "Landa",
      email: "test_user_63274575@testuser.com",
      phone: {
        area_code: "11",
        number: 22223333,
      },
      address: {
        street_name: "Falsa",
        street_number: 123,
        zip_code: "1111",
      },
    },
    back_urls: {
      success:
        "https://bacondotnet-mp-commerce-nodej.herokuapp.com/feedback?feedback=success",
      failure:
        "https://bacondotnet-mp-commerce-nodej.herokuapp.com/feedback?feedback=failure",
      pending:
        "https://bacondotnet-mp-commerce-nodej.herokuapp.com/feedback?feedback=pending",
    },
    auto_return: "approved",
    payment_methods: {
      excluded_payment_methods: [
        {
          id: "amex",
        },
      ],
      excluded_payment_types: [
        {
          id: "atm",
        },
      ],
      installments: 6,
    },
    notification_url:
      "https://bacondotnet-mp-commerce-nodej.herokuapp.com/notifications",
  };

  mercadopago.preferences
    .create(preference)
    .then(function (response) {
      res.json(response.body);
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.post("/notifications", (req, res) => {
  console.log(req.body);

  if (req.body.action == "payment.created") {
    return res.status(201).json({});
  } else {
    return res.status(200).json({});
  }
});

app.listen(port);
