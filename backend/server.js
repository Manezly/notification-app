const express = require('express');
const app = express();
const promisePool = require('./db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const jwt_key =
  '1d9ff7bf8f3e9d2249e36e62d88e554dde19e9b46fec698fc387bed6ce29a2b2';

const port = 3000;

app.use(express.json());

app.get('/data', (req, res) => {
  console.log('done');
  res.json({ message: 'Hello from Node.js server!' });
});

// User Sign up
app.post('/signUp', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Missing username or password' });
  }

  try {
    // Check if username already exists
    const checkUserSqlQuery = 'SELECT * FROM user WHERE username = ?';
    const [existingUser] = await promisePool.query(checkUserSqlQuery, [
      username,
    ]);
    if (existingUser.length > 0) {
      return res.status(409).json({ message: 'Username already taken' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    console.log(hashedPassword);

    // Use parameterized query to prevent SQL injection (?, ?)
    const sql = 'INSERT INTO user (username, password) VALUES (?, ?)';
    const [result] = await promisePool.query(sql, [username, hashedPassword]);

    console.log('Insert result:', result);

    res.json({
      message: 'Form data received and inserted successfully',
      data: { username },
    });
  } catch (error) {
    console.error('Error inserting data into the database:', error);
    res.status(500).json({ message: 'Error inserting data into the database' });
  }
});

// User Sign in
app.post('/signIn', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Missing username or password' });
  }

  try {
    const sql = 'SELECT * FROM user WHERE username = ?';
    const [rows] = await promisePool.query(sql, [username]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, jwt_key, {
      expiresIn: '1d',
    });

    res.json({
      message: 'Login successful',
      token,
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, jwt_key, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.post('/verify-token', authenticateToken, (req, res) => {
  res.json({ valid: true });
});

app.get('/user', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch user information and their company
    const userQuery = `
      SELECT 
        u.id AS user_id,
        u.username,
        u.company_id AS company_id,
        c.name AS company_name
      FROM 
        user u
      JOIN 
        company c ON u.company_id = c.id
      WHERE 
        u.id = ?;
    `;

    const [userRows] = await promisePool.query(userQuery, [userId]);

    if (userRows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = userRows[0];

    // Fetch all areas for the company
    const allAreasQuery = `
      SELECT 
        a.id AS area_id,
        a.name AS area_name
      FROM 
        area a
      WHERE 
        a.company_id = ?;
    `;

    const [allAreasRows] = await promisePool.query(allAreasQuery, [
      user.company_id,
    ]);

    // Fetch all zones for the company
    const allZonesQuery = `
      SELECT 
        z.id AS zone_id,
        z.name AS zone_name
      FROM 
        zone z
      JOIN 
        area a ON z.area_id = a.id
      WHERE 
        a.company_id = ?;
    `;

    const [allZonesRows] = await promisePool.query(allZonesQuery, [
      user.company_id,
    ]);

    // Fetch user-specific areas
    const userAreasQuery = `
      SELECT 
        a.id AS area_id,
        a.name AS area_name
      FROM 
        user_area ua
      JOIN 
        area a ON ua.area_id = a.id
      WHERE 
        ua.user_id = ?;
    `;

    const [userAreasRows] = await promisePool.query(userAreasQuery, [userId]);

    // Fetch user-specific zones
    const userZonesQuery = `
      SELECT 
        z.id AS zone_id,
        z.name AS zone_name
      FROM 
        user_zone uz
      JOIN 
        zone z ON uz.zone_id = z.id
      WHERE 
        uz.user_id = ?;
    `;

    const [userZonesRows] = await promisePool.query(userZonesQuery, [userId]);

    // Return the user data along with all and user-specific areas and zones
    res.json({
      user: {
        id: user.user_id,
        username: user.username,
        company: {
          id: user.company_id,
          name: user.company_name,
        },
      },
      all_areas: allAreasRows.map((area) => ({
        id: area.area_id,
        name: area.area_name,
      })),
      all_zones: allZonesRows.map((zone) => ({
        id: zone.zone_id,
        name: zone.zone_name,
      })),
      user_areas: userAreasRows.map((area) => ({
        id: area.area_id,
        name: area.area_name,
      })),
      user_zones: userZonesRows.map((zone) => ({
        id: zone.zone_id,
        name: zone.zone_name,
      })),
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Error fetching user data' });
  }
});

// Send message
app.post('/message', async (req, res) => {
  const { areas, zones, message, companyId } = req.body;

  if (!areas.length && !zones.length) {
    return res.status(400).json({ message: 'No areas or zones selected' });
  }

  if (!message) {
    return res.status(400).json({ message: 'No message provided' });
  }

  try {
    // Insert into the notification table
    const insertNotificationSql =
      'INSERT INTO notification (company_id, message) VALUES (?, ?)';
    const [notificationResult] = await promisePool.query(
      insertNotificationSql,
      [companyId, message]
    );

    const notificationId = notificationResult.insertId;

    // Insert into notification_area table if areas are selected
    if (areas.length) {
      const insertAreasSql = `
        INSERT INTO notification_area (notification_id, area_id)
        VALUES (?, ?)
      `;
      for (let areaId of areas) {
        await promisePool.query(insertAreasSql, [notificationId, areaId]);
      }
    }

    // Insert into notification_zone table if zones are selected
    if (zones.length) {
      const insertZonesSql = `
        INSERT INTO notification_zone (notification_id, zone_id)
        VALUES (?, ?)
      `;
      for (let zoneId of zones) {
        await promisePool.query(insertZonesSql, [notificationId, zoneId]);
      }
    }

    res.json({
      message: 'Notification and associated areas/zones inserted successfully',
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Error sending message' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
