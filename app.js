const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql");
var bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
var md5 = require("md5");
var crypto = require("crypto");

const saltRounds = 10;
const db = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "placementapp",
});
var corsOptions = {
	origin: "http://localhost:8100",
};

app.use(cors(corsOptions));

app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(
	express.urlencoded({
		extended: true,
	})
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.raw());

// for parsing multipart/form-data
app.get("/home", cors(corsOptions), (req, res, next) => {
	res.json("hi");
});

app.post("/register", cors(corsOptions), async (req, res, next) => {
	console.log(req.body);
	let encpass;

	const password = await md5(req.body.password, 10);

	let registeruser = `INSERT INTO pa_users (name, phoneno,email,password,branch,gender,dob)
    VALUES ("${req.body.name}","${req.body.mobile}","${req.body.email}","${password}","${req.body.branch}","${req.body.gender}","${req.body.dob}")`;
	console.log(registeruser);
	db.query(registeruser, (err, result) => {
		if (err) {
			throw err;
			res.json({
				status: 1062,
				Statausmessge: "Something went wrong",
			});
		} else {
			console.log(result.insertId);
			res.json({
				id: result.insertId,
				status: 200,
				Statausmessge: "Sucess",
			});
		}
	});
});

app.post("/updateprofile", cors(corsOptions), (req, res, next) => {
	let updateprofile = `UPDATE pa_users SET marks10 = "${req.body.edudeatils.percent10}",marks12 = "${req.body.edudeatils.percent12}",marksbtech = "${req.body.edudeatils.percentbe}",marksmtech = "${req.body.edudeatils.percentme}",objective ="${req.body.objective}", jobdata='${req.body.jobdata}',projectdata='${req.body.projectdata}',skills='${req.body.skills}'  WHERE id = "${req.body.id}"`;
	db.query(updateprofile, (err, result) => {
		if (err) {
			throw err;
			res.json({
				status: 1062,
				Statausmessge: "Something went wrong",
			});
		} else {
			res.json({
				status: 200,
				Statausmessge: "Sucess",
			});
		}
	});
});

app.post("/getuserdeatils", cors(corsOptions), (req, res, next) => {
	console.log(req.body);
	let updateprofile = `SELECT * FROM pa_users WHERE id = "${req.body.id}"`;
	db.query(updateprofile, (err, result) => {
		if (err) {
			throw err;
			res.json({
				status: 1062,
				Statausmessge: "Something went wrong",
			});
		} else {
			function replacer(key, val) {
				console.log(typeof val);
				if (val === null || val === "") return "Not Filled";
				return val;
			}

			const stringified = JSON.stringify(result, replacer);
			res.json({
				result: JSON.parse(stringified),
				status: 200,
				Statausmessge: "Sucess",
			});
		}
	});
});

app.post("/getfeeds", cors(corsOptions), (req, res, next) => {
	console.log("yes", req.body);
	let updateprofile = `SELECT pa_feeds.*,pa_feedslike.userid FROM pa_feeds LEFT JOIN pa_feedslike on pa_feeds.id = pa_feedslike.feedid AND pa_feedslike.userid = "${req.body.id}"`;
	db.query(updateprofile, (err, result) => {
		if (err) {
			throw err;
			res.json({
				status: 1062,
				Statausmessge: "Something went wrong",
			});
		} else {
			res.json({
				result: result,
				status: 200,
				Statausmessge: "Sucess",
			});
		}
	});
});

app.post("/feedslike", cors(corsOptions), (req, res, next) => {
	console.log("yes", req.body);
	let insertlike = `INSERT INTO pa_feedslike (userid,feedid) VALUES("${req.body.id}","${req.body.feedid}")`;
	let updatelike = `UPDATE pa_feeds SET likes = "${
		req.body.likes + 1
	}" where id="${req.body.feedid}"`;
	db.query(insertlike, (err, result) => {
		if (err) {
			res.json({
				status: 1062,
				Statausmessge: "Something went wrong",
			});
		} else {
			db.query(updatelike, (err, result) => {
				if (err) {
					throw err;
					res.json({
						status: 1062,
						Statausmessge: "Something went wrong",
					});
				} else {
					res.json({
						status: 200,
						Statausmessge: "Sucess",
					});
				}
			});
		}
	});
});

app.post("/unlike", cors(corsOptions), (req, res, next) => {
	console.log("yes", req.body);
	let deletelike = `DELETE FROM pa_feedslike where feedid="${req.body.feedid}" and userid="${req.body.id}"`;
	let updatelike = `UPDATE pa_feeds SET likes = "${
		req.body.likes - 1
	}" where id="${req.body.feedid}"`;
	db.query(deletelike, (err, result) => {
		if (err) {
			res.json({
				status: 1062,
				Statausmessge: "Something went wrong",
			});
			s;
		} else {
			db.query(updatelike, (err, result) => {
				if (err) {
					throw err;
					res.json({
						status: 1062,
						Statausmessge: "Something went wrong",
					});
				} else {
					res.json({
						status: 200,
						Statausmessge: "Sucess",
					});
				}
			});
		}
	});
});

app.get("/getTecheronline", cors(corsOptions), (req, res, next) => {
	console.log(req.body);
	let getTecheronline = `SELECT * FROM pa_teachers WHERE online = 1`;
	db.query(getTecheronline, (err, result) => {
		if (err) {
			throw err;
			res.json({
				status: 1062,
				Statausmessge: "Something went wrong",
			});
		} else {
			res.json({
				result: result,
				status: 200,
				Statausmessge: "Sucess",
			});
		}
	});
});

app.get("/company", cors(corsOptions), (req, res, next) => {
	console.log(req.body);
	let getTecheronline = `SELECT * FROM pa_campusnews`;
	db.query(getTecheronline, (err, result) => {
		if (err) {
			throw err;
			res.json({
				status: 1062,
				Statausmessge: "Something went wrong",
			});
		} else {
			res.json({
				result: result,
				status: 200,
				Statausmessge: "Sucess",
			});
		}
	});
});

app.post("/login", cors(corsOptions), (req, res, next) => {
	console.log(req.body);
	let getTecheronline = `SELECT id,name,phoneno,password FROM pa_users where phoneno="${req.body.email}"`;
	db.query(getTecheronline, (err, result) => {
		if (err) {
			throw err;
			res.json({
				status: 1062,
				Statausmessge: "Something went wrong",
			});
		} else {
			if (result.length == 0) {
				res.json({
					status: 501,
					Statausmessge: "User Not Found",
				});
			} else if (result.length >= 1) {
				var dcrptpass = crypto
					.createHash("md5")
					.update(req.body.password)
					.digest("hex");
				if (result[0].password === dcrptpass) {
					res.json({
						id: result[0].id,
						name: result[0].name,
						status: 200,
						Statausmessge: "Success",
					});
				} else {
					res.json({
						status: 301,
						Statausmessge: "Password Not Match, Please Try Again",
					});
				}
			}
		}
	});
});

app.listen(3000);
