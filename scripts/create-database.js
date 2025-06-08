#!/usr/bin/env node

const { spawn } = require('child_process');

console.log('🗄️ Creating webduh 10X Database...');
console.log('='.repeat(50));

// Try to create the database
const createDB = spawn('createdb', ['webduh_db'], { stdio: 'inherit' });

createDB.on('close', (code) => {
  if (code === 0) {
    console.log('✅ Database "webduh_db" created successfully!');
    console.log('🚀 Your 10X webduh platform is ready!');
    console.log('');
    console.log('Next steps:');
    console.log('1. 🚀 npm run dev - Start the servers');
    console.log('2. 🌐 Open http://localhost:3000');
    console.log('3. ⌘K - Use the command palette');
    console.log('');
    console.log('🎉 Welcome to the future of deployment! 🚀');
  } else {
    console.log('⚠️  Database might already exist or PostgreSQL not available');
    console.log('💡 Alternative: Use Docker for PostgreSQL:');
    console.log(
      '   docker run --name webduh-postgres -e POSTGRES_DB=webduh_db -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15',
    );
    console.log('');
    console.log(
      '🚀 Try running "npm run dev" anyway - the dashboard should work!',
    );
  }
});

createDB.on('error', (err) => {
  console.log("📝 PostgreSQL CLI not found - that's okay!");
  console.log('💡 The dashboard will work without the API backend');
  console.log('🚀 Run "npm run dev" to see the revolutionary 10X interface!');
  console.log('');
  console.log(
    '🌟 To get full functionality, install PostgreSQL or use Docker:',
  );
  console.log(
    '   docker run --name webduh-postgres -e POSTGRES_DB=webduh_db -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15',
  );
});
