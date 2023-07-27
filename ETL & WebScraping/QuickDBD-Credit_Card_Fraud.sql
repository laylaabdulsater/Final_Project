-- Exported from QuickDBD: https://www.quickdatabasediagrams.com/
-- Link to schema: https://app.quickdatabasediagrams.com/#/d/2bPpZK
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.


CREATE TABLE "public_hidden_people" (
    "first" varchar(300),   NOT NULL,
    "last" varchar(300),   NOT NULL,
    "merchant" varchar(300),   NOT NULL,
    "category" varchar(300),   NOT NULL,
    "amt" float,   NOT NULL,
    "gender" varchar(300),   NOT NULL,
    "street" varchar(300),   NOT NULL,
    "city" varchar(300),   NOT NULL,
    "state" varchar(300),   NOT NULL,
    "lat" float,   NOT NULL,
    "long" float,   NOT NULL,
    "city_pop" float,   NOT NULL,
    "job" varchar(300),   NOT NULL,
    "dob" date,   NOT NULL,
    "merch_lat" float,   NOT NULL,
    "merch_long" float   NOT NULL
);

CREATE TABLE "fraud_address" (
    "first" varchar(300),   NOT NULL,
    "last" varchar(300),   NOT NULL,
    "street" varchar(300),   NOT NULL,
    "city" varchar(300),   NOT NULL,
    "state" varchar(300),   NOT NULL,
    "lat" float,   NOT NULL,
    "long" float,   NOT NULL,
    "city_pop" float   NOT NULL
);

CREATE TABLE "fraud_personal" (
    "first" varchar(300),   NOT NULL,
    "last" varchar(300),   NOT NULL,
    "gender" varchar(300),   NOT NULL,
    "job" varchar(300),   NOT NULL,
    "dob" date   NOT NULL
);

CREATE TABLE "fraud_merch" (
    "first" varchar(300),   NOT NULL,
    "last" varchar(300),   NOT NULL,
    "merchant" varchar(300),   NOT NULL,
    "category" varchar(300),   NOT NULL,
    "amt" float,   NOT NULL,
    "merch_lat" float,   NOT NULL,
    "merch_long" float   NOT NULL
);

ALTER TABLE "public_hidden_people" ADD CONSTRAINT "fk_public_hidden_people_first_last" FOREIGN KEY("first", "last")
REFERENCES "fraud_personal" ("first", "last");

ALTER TABLE "public_hidden_people" ADD CONSTRAINT "fk_public_hidden_people_merchant" FOREIGN KEY("merchant")
REFERENCES "fraud_merch" ("merchant");

ALTER TABLE "public_hidden_people" ADD CONSTRAINT "fk_public_hidden_people_city" FOREIGN KEY("city")
REFERENCES "fraud_address" ("city");

ALTER TABLE "fraud_address" ADD CONSTRAINT "fk_fraud_address_first_last" FOREIGN KEY("first", "last")
REFERENCES "fraud_personal" ("first", "last");

ALTER TABLE "fraud_merch" ADD CONSTRAINT "fk_fraud_merch_first_last" FOREIGN KEY("first", "last")
REFERENCES "fraud_personal" ("first", "last");

