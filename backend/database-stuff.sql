SELECT * FROM notification_app.users;

CREATE TABLE company (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE area (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    FOREIGN KEY (company_id) REFERENCES company(id) ON DELETE CASCADE
);

CREATE TABLE zone (
    id INT AUTO_INCREMENT PRIMARY KEY,
    area_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    FOREIGN KEY (area_id) REFERENCES area(id) ON DELETE CASCADE
);

CREATE TABLE notification (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    message TEXT NOT NULL,
    urgent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES company(id) ON DELETE CASCADE
);

CREATE TABLE notification_area (
    notification_id INT NOT NULL,
    area_id INT NOT NULL,
    PRIMARY KEY (notification_id, area_id),
    FOREIGN KEY (notification_id) REFERENCES notification(id) ON DELETE CASCADE,
    FOREIGN KEY (area_id) REFERENCES area(id) ON DELETE CASCADE
);

CREATE TABLE notification_zone (
    notification_id INT NOT NULL,
    zone_id INT NOT NULL,
    PRIMARY KEY (notification_id, zone_id),
    FOREIGN KEY (notification_id) REFERENCES notification(id) ON DELETE CASCADE,
    FOREIGN KEY (zone_id) REFERENCES zone(id) ON DELETE CASCADE
);

INSERT INTO company (name) VALUES ('Leslie Company Ltd');

INSERT INTO area (company_id, name) VALUES
(1, "Top Floor"), 
(1, "Bottom Floor");

INSERT INTO zone (area_id, name) VALUES
(1, 'Zone A'),
(1, 'Zone B'),
(1, 'Zone C'),
(2, 'Zone D'),
(2, 'Zone E');

CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    company_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES company(id)
);

UPDATE user
SET company_id = 1 WHERE id = 1;

CREATE TABLE user_area (
    user_id INT,
    area_id INT,
    PRIMARY KEY (user_id, area_id),
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (area_id) REFERENCES area(id)
);

CREATE TABLE user_zone (
    user_id INT,
    zone_id INT,
    PRIMARY KEY (user_id, zone_id),
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (zone_id) REFERENCES zone(id)
);