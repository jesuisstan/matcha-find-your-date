const { execSync } = require('child_process');
const readline = require('readline');

// Function to prompt user for input
const promptUser = (query) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans);
    })
  );
};

// Try to load 'chalk'. If not available, ask to install or fallback to no-color.
let chalk;
try {
  chalk = require('chalk');
} catch (err) {
  (async () => {
    const answer = await promptUser(
      'Chalk (text colorizer) is not installed. Do you want to install it? (y/n): '
    );
    if (answer.toLowerCase() === 'y') {
      console.log('Installing chalk...');
      try {
        execSync('npm install chalk', { stdio: 'inherit' });
        chalk = require('chalk');
        console.log(chalk.green('Chalk installed successfully!'));
      } catch (installError) {
        console.error('Failed to install chalk:', installError);
        chalk = { blue: (text) => text, green: (text) => text, red: (text) => text }; // Fallback
      }
    } else {
      console.log('Running without chalk colors.');
      chalk = { blue: (text) => text, green: (text) => text, red: (text) => text }; // Fallback
    }

    // After handling chalk, run the commands
    runCommands();
  })();
}

// Function to run shell commands
const runCommand = (command) => {
  try {
    console.log(chalk.blue(`Running: ${command}`)); // Command in blue
    execSync(command, { stdio: 'inherit' });
    console.log(chalk.green(`${command} - completed successfully.`)); // Success in green
  } catch (error) {
    console.error(chalk.red(`${command} - failed with error:`), error); // Error in red
    process.exit(1); // Exit on failure
  }
};

// Sequentially run each script
const runCommands = () => {
  runCommand('node ./scripts/delete-table.js visits');
  runCommand('node ./scripts/delete-table.js likes');
  runCommand('node ./scripts/delete-table.js matches');
  runCommand('node ./scripts/delete-table.js blocked_users');
  runCommand('node ./scripts/delete-table.js notifications');
  runCommand('node ./scripts/delete-table.js users');

  runCommand('node ./scripts/create-table-users.js');
  runCommand('node ./scripts/fill-table-users.js');
  runCommand('node ./scripts/create-tables-activity.js');
};

// If chalk is already available, run commands directly
if (chalk) {
  runCommands();
}

//// script version: 0.0.1 (no color)
//const { execSync } = require('child_process');

//// Function to run shell commands
//const runCommand = (command) => {
//  try {
//    console.log(`Running: ${command}`);
//    execSync(command, { stdio: 'inherit' });
//    console.log(`${command} - completed successfully.`);
//  } catch (error) {
//    console.error(`${command} - failed with error:`, error);
//    process.exit(1); // Exit on failure
//  }
//};

//// Sequentially run each script
//runCommand('node ./scripts/delete-table.js users');
//runCommand('node ./scripts/create-table-users.js');
//runCommand('node ./scripts/fill-table-users.js');
