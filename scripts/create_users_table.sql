CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  crmid INTEGER,
  firstName VARCHAR(255) NOT NULL,
  lastName VARCHAR(255) NOT NULL,
  age INTEGER,
  modemType VARCHAR(255),
  serviceType VARCHAR(255),
  plan VARCHAR(255),
  quota VARCHAR(255),
  speed VARCHAR(255),
  contract VARCHAR(255),
  customerReference VARCHAR(255),
  newConnection VARCHAR(255)
);
