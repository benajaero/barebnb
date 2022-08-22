import { Pool } from 'pg';

const pool = new Pool();

// util

function hashPassword() {

}

// end util

export async function getAllPlaces() {
    const { places } = await pool.query('SELECT * FROM places');

    return places;
} 

export async function getPlace(placeId) {
    const { place } = await pool.query('SELECT * FROM place WHERE id = $1', [placeId]);

    return place;
}

export async function createPlace(token, name, description, price, address, isPublic) {
    const userId = getUserId(token);
    const { place } = await pool.query('INSERT INTO places (name, description, price, address, public, user_id) VALUES ($1, $2, $3, $4, $5, $6) WHERE user_id = $6 RETURNING id', [name, description, price, address, isPublic, userId]);

    return place[0].id;
}

export async function updatePlace(token, placeId, description, price, address, isPublic) {

    const userId = getUserId(token);
    const { place } = await pool.query('UPDATE places SET description = $1, price = $2, address = $3, isPublic = $4 WHERE id = $5 AND user_id = $6 RETURNING id', [description, price, address, isPublic, placeId, userId]);

    return place[0].id;

}

export async function deletePlace(token, placeId) {
    const userId = getUserId(token);

    await pool.query('DELETE FROM places WHERE id = $1 AND user_id = $2', [placeId, userId]);
}

async function generateToken(userId) {
    // TODO actually generate the token
    
    const token = '';

    await pool.query('INSERT INTO tokens (token, user_id) VALUES ($1, $2)', [token, userId]);

    const { tokens } = await pool.query('SELECT * FROM tokens WHERE token = $1', [token]);

    return tokens[0].token;
}

export async function doesUserExist(username) {
    const { users } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    return (users.length > 0);
}

export async function addNewUser(username, email, first_name, last_name, password) {
    const user = await pool.query('INSERT INTO users (username, email, first_name, last_name, password) VALUES ($1, $2, $3, $4, $5) RETURNING id', [username, email, first_name, last_name, password]);

    return generateToken(user);
}

// get userId from token
export async function getUserId(token) {
    const { users } = await pool.query('SELECT user_id FROM tokens WHERE token = $1', [token]);

    return users[0].user_id;
}

export async function loginUser(email, password) {
    const hashedPassword = hashPassword(password);
    const { user } = await pool.query('SELECT id FROM users WHERE email = $1 AND password = $2', [email, password]);

    if (user.length > 0) {
        return generateToken(user[0].id)
    }
}

export async function createDatabase() {
    await pool.query(`
    CREATE TABLE users (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
);

CREATE TABLE notifications (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    message VARCHAR(1024) NOT NULL,
    been_read bool NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON
);

CREATE TABLE places (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    price FLOAT NOT NULL,
    address VARCHAR(255) NOT NULL,
    public BOOLEAN NOT NULL DEFAULT true,
    FOREIGN KEY (user_id) REFERENCES users(id),
);

CREATE TABLE ratings (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    rating INTEGER NOT NULL BETWEEN 0 and 5,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE availabilitys (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    date DATE NOT NULL,
    FOREIGN KEY (place_id) REFERENCES places(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
);

CREATE TABLE photos (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    filename VARCHAR(255) NOT NULL,
    FOREIGN KEY (place_id) REFERENCES places(id)
);

CREATE TABLE rented_places (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    FOREIGN KEY (place_id) REFERENCES places(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE tokens (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    token varchar(1024) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id)
);`);
}
