CREATE TABLE address
(
    id character varying(36) COLLATE pg_catalog."default" NOT NULL  PRIMARY KEY,
    "created" timestamp with time zone NOT NULL DEFAULT now(),
    "addressLine1" character varying(264) COLLATE pg_catalog."default" NOT NULL DEFAULT ''::text,
    "zipCode" character varying(32) COLLATE pg_catalog."default" NOT NULL DEFAULT ''::text,
    "city" character varying(128) COLLATE pg_catalog."default" NOT NULL DEFAULT ''::text,
    "country" character varying(64) COLLATE pg_catalog."default" NOT NULL DEFAULT ''::text
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;
