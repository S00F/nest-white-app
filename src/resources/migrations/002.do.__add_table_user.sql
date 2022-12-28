CREATE TABLE "user"
(
    id character varying(36) COLLATE pg_catalog."default" NOT NULL  PRIMARY KEY,
    "created" timestamp with time zone NOT NULL DEFAULT now(),
    "firstname" character varying(64) COLLATE pg_catalog."default" NOT NULL DEFAULT ''::text,
    "lastname" character varying(64) COLLATE pg_catalog."default" NOT NULL DEFAULT ''::text,
    "age" smallint NOT NULL,
    "addressId" character varying(36) COLLATE pg_catalog."default" UNIQUE
    ,
    CONSTRAINT "FK_USER_ADDRESS" FOREIGN KEY ("addressId")
        REFERENCES "address" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;
