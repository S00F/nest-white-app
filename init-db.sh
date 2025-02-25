#!/bin/bash
set -e

psql -h localhost -d postgres -U postgres <<-EOSQL
	CREATE DATABASE starterapp;
	\c starterapp;
	CREATE USER starterapp;
	ALTER USER starterapp PASSWORD 'starterapp';
	GRANT ALL PRIVILEGES ON DATABASE starterapp TO starterapp;
	ALTER role starterapp in DATABASE starterapp set search_path='starterapp';
EOSQL	


psql -h localhost -d postgres -U postgres -v ON_ERROR_STOP=1 <<-EOSQL
\c starterapp;
CREATE SCHEMA IF NOT EXISTS starterapp AUTHORIZATION starterapp;
EOSQL
