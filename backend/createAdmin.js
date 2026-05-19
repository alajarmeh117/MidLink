const bcrypt = require('bcrypt');
const { query } = require('./config/db');

const createAdmin = async () => {
  const name = 'Admin User';
  const email = 'admin@example.com';
  const password = '123456';

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); 

    // Check if admin already exists
    const checkResult = await query('SELECT * FROM admins WHERE email = $1', [email]);
    
    if (checkResult.rows.length > 0) {
      console.log('Admin already exists. Updating password...');
      await query('UPDATE admins SET password = $1 WHERE email = $2', [hashedPassword, email]);
      console.log('Admin password updated successfully!');
    } else {
      console.log('Creating new admin...');
      await query(
        'INSERT INTO admins (name, email, password) VALUES ($1, $2, $3)',
        [name, email, hashedPassword]
      );
      console.log('Admin created successfully!');
    }

    console.log('\nAdmin credentials:');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Hashed Password:', hashedPassword);
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();