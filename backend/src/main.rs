use bson::doc;
use lettre::transport::smtp::authentication::Credentials;
use lettre::{Message, SmtpTransport, Transport};
use mongodb::{options::ClientOptions, Client};
use rocket::fairing::{Fairing, Info, Kind};
use rocket::form::Form;
use rocket::http::Header;
use rocket::response::status::Accepted;
use rocket::response::Redirect;
use rocket::State;
use rocket::{Request, Response};
use std::time::Duration;
use uuid::Uuid;

#[macro_use]
extern crate rocket;
extern crate mongodb;

pub struct Cors;

#[rocket::async_trait]
impl Fairing for Cors {
    fn info(&self) -> Info {
        Info {
            name: "Cross-Origin-Resource-Sharing Middleware",
            kind: Kind::Response,
        }
    }

    async fn on_response<'r>(&self, _request: &'r Request<'_>, response: &mut Response<'r>) {
        response.set_header(Header::new(
            "access-control-allow-origin",
            "http://localhost:3000",
        ));
        response.set_header(Header::new(
            "access-control-allow-methods",
            "GET, PATCH, OPTIONS, POST",
        ));
    }
}

#[rocket::main]
async fn main() -> mongodb::error::Result<()> {
    let client_options = ClientOptions::parse(
        "YOUR CONNECT MONGO ATLAS BD" // https://www.mongodb.com/ https://www.mongodb.com/
    ).await?;

    let client = Client::with_options(client_options)?;
    let _database = client.database("YOUR DATABASE"); //Your database Your database Your database

    #[get("/")]
    async fn index() -> &'static str {
        "Cross Middleware Push"
    }

    #[derive(FromForm)]
    struct FormData {
        nick_name: String,
        inp_m: String,
        pass_acc_first: String,
        pass_acc_again: String,
    }

    #[post("/submit", data = "<form_data>")]
    async fn submit(
        client: &State<Client>,
        form_data: Form<FormData>,
    ) -> Result<Redirect, Accepted<String>> {
        let FormData {
            nick_name,
            inp_m,
            pass_acc_first,
            pass_acc_again,
        } = form_data.into_inner();
        let _name = nick_name.clone();
        let email = inp_m.clone();
        let _password = pass_acc_first.clone();
        let _confirm_password = pass_acc_again.clone();

        let collection = client.database("YOUR DATABASE").collection("users");

        let uuid = Uuid::new_v4().to_string();
        let doc = doc! {"name": nick_name, "email": inp_m, "passwd_first": pass_acc_first, "passwd_again": pass_acc_again, "email_verified": false, "uuid": &uuid};

        match collection.insert_one(doc, None).await {
            Ok(_) => {
                let email = Message::builder()
                        .from("YOUR MAIL SENDER".parse().unwrap()) //SENDER OF YOUR MAIL SENDER OF YOUR MAIL
                        .to(email.parse().unwrap())
                        .subject("Hello hello")
                        .body(format!("register:\nEmail: {}\nConfirmation: http://localhost:8000/verify/{}", email, uuid))
                        .unwrap();

                let creds = Credentials::new(
                    "YOUR MAIL SENDER".to_string(), //SENDER OF YOUR MAIL SENDER OF YOUR MAIL
                    "YOUR PASSWD SENDER".to_string(),      //YOUR PASSWD SENDER YOUR PASSWD SENDER YOUR PASSWD SENDER
                );
                let mailer = SmtpTransport::relay("YOUR MAIL Transport")
                    .unwrap()
                    .credentials(creds)
                    .build();

                // Send the email
                match mailer.send(&email) {
                    Ok(_) => {
                        println!("Email sent successfully!");
                        Ok(Redirect::to("/"))
                    }
                    Err(e) => {
                        println!("Error sending email: {:?}", e);
                        Err(Accepted(Some(
                            "Data inserted successfully but error sending email".to_owned(),
                        )))
                    }
                }
            }
            Err(e) => Err(Accepted(Some(format!("Error inserting data: {}", e)))),
        }
    }
    //Checking mail with status
    #[get("/verify/<uuid>")]
    async fn verify(client: &State<Client>, uuid: String) -> Result<Redirect, String> {
        let collection = client
            .database("YOUR DATABASE")
            .collection::<bson::document::Document>("users");
        let filter = doc! {"uuid": &uuid};
        let update = doc! {"$set": {"email_verified": true}};
        match collection.update_one(filter, update, None).await {
            Ok(result) => {
                if result.modified_count == 1 {
                    tokio::time::sleep(Duration::from_secs(2)).await;
                    let url = "http://127.0.0.1:3000";
                    Ok(Redirect::to(url.to_string()))
                } else {
                    Err("Failed to update document".to_owned())
                }
            }
            Err(e) => Err(format!("Error updating document: {}", e)),
        }
    }

    #[derive(FromForm)]
    struct FormDataLogin {
        inp_m: String,
        pass_acc_first: String,
    }

    #[post("/", data = "<form_login>")]
    async fn login(
        client: &State<Client>,
        form_login: Form<FormDataLogin>,
    ) -> Result<Redirect, Accepted<String>> {
        let FormDataLogin {
            inp_m,
            pass_acc_first,
        } = form_login.into_inner();
        let collection = client
            .database("YOUR DATABASE") //Your database Your database Your database
            .collection::<bson::document::Document>("users");
        let query = doc! {"email": inp_m, "passwd_first": pass_acc_first};

        if let Ok(Some(_)) = collection.find_one(query, None).await {
            Ok(Redirect::to(uri!(user_found)))
        } else {
            Ok(Redirect::to(uri!(user_notfound)))
        }
    }

        #[get("/user_found")]
        fn user_found() -> rocket::serde::json::Json<String> {
            println!("Sing-in");
            rocket::serde::json::Json(format!("User found"))
        }
        
        #[get("/user_notfound")]
        fn user_notfound() -> rocket::serde::json::Json<String> {
            println!("Not found user.");
            rocket::serde::json::Json(format!(
                "User not found or wrong password entered."
            ))
        }
    
    let _rocket = rocket::build()
        .attach(Cors)
        .mount(
            "/",
            routes![index, submit, login, verify, user_notfound, user_found],
        )
        .manage(client)
        .launch()
        .await;
    Ok(())
}
