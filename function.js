var express = require("express");
var app = express();
var ws = require("ws");

var employee = {
  employee9: {
    id: 9,
    companyName: "Foodie Incorporated",
    employeeName: "Staff",
    position: "Junior Developer",
    location: "Buhangin, Davao City",
  },

  employee10: {
    id: 10,
    companyName: "Davao Malayan Colleges",
    employeeName: "Head",
    position: "Network Analysis",
    loccation: "Sasa, Davao City",
  },
};

// The addUser endpoint (POST)
app.post("/addUsers", function (req, res) {

  ws.readFile(__dirname + "/" + "server.json", "utf8", function (err, data) {
    data = JSON.parse(data);

    data.employee9 = employee.employee9;
    data.employee10 = employee.employee10;

    console.log(data);
    res.end(JSON.stringify(data));
  });
});

// The Endpoint to get List of Users (GET)
app.get("/getUsers", function (req, res) {
  ws.readFile(__dirname + "/" + "server.json", "utf8", function (err, data) {
    console.log(data);
    res.end(data);
  });
});

// The Endpoint to get a single user by id
app.get("/:id", function (req, res) {
  ws.readFile(__dirname + "/" + "server.json", "utf8", function (err, data) {
    var employees = JSON.parse(data);
    var employee = employees["employee" + req.params.id];
    if (employee) {
      console.log(employee);
      res.end(JSON.stringify(employee));
    } else {
      res.status(404).send();
    }
  });
});

// The Endpoint to get a single user by companyName
app.get("/companyName/:companyName", function (req, res) {
  const companyName = req.params.companyName.replace(/%20/g, " ");
  ws.readFile(__dirname + "/" + "server.json", "utf8", function (err, data) {
    var employees = JSON.parse(data);
    var matchingEmployees = Object.values(employees).filter(
      (employee) => employee.companyName === companyName
    );
    if (matchingEmployees.length > 0) {
      console.log(matchingEmployees);
      res.end(JSON.stringify(matchingEmployees));
    } else {
      res.status(404).send();
    }
  });
});

// THe Endpoint of updating specific users (PUT)
app.put("/updateUser/:id", function (req, res) {
  const id = req.params.id;
  const updatedInfo = req.body;

  ws.readFile(__dirname + "/" + "server.json", "utf8", function (err, data) {
    let users = JSON.parse(data);
    if (users["employee" + id]) {
      users["employee" + id] = { ...users["employee" + id], ...updatedInfo };
      ws.writeFile(
        __dirname + "/" + "server.json",
        JSON.stringify(users),
        function (err) {
          if (err) throw err;
          res.end(JSON.stringify(users["employee" + id]));
        }
      );
    } else {
      res.status(404).send();
    }
  });
});

// The Endpoint of deleting specific users (DELETE)
app.delete("/deleteUsers/:id", function (req, res) {
  const id = req.params.id;
  ws.readFile(__dirname + "/" + "server.json", "utf8", function (err, data) {
    let users = JSON.parse(data);
    if (users["employee" + id]) {
      delete users["employee" + id];
      ws.writeFile(
        __dirname + "/" + "server.json",
        JSON.stringify(users),
        function (err) {
          if (err) throw err;
          res.end(JSON.stringify(users));
        }
      );
    } else {
      res.status(404).send();
    }
  });
});

// Create a server to listen at port 3000
var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("REST API demo app listening at http://%s:%s", host, port);
});
