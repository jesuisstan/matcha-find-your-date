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

// Function to dynamically load ESM modules
const loadChalk = async () => {
  try {
    const chalk = await import('chalk');
    return chalk.default; // ESM modules use `default` exports
  } catch (err) {
    return null;
  }
};

// Function to run shell commands
const runCommand = (chalk, command) => {
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
const runCommands = (chalk) => {
  runCommand(chalk, 'node ./scripts/delete-table.js chat');
  runCommand(chalk, 'node ./scripts/delete-table.js visits');
  runCommand(chalk, 'node ./scripts/delete-table.js likes');
  runCommand(chalk, 'node ./scripts/delete-table.js matches');
  runCommand(chalk, 'node ./scripts/delete-table.js blocked_users');
  runCommand(chalk, 'node ./scripts/delete-table.js notifications');
  runCommand(chalk, 'node ./scripts/delete-table.js users');

  runCommand(chalk, 'node ./scripts/create-table-users.js');
  runCommand(chalk, 'node ./scripts/fill-table-users.js');
  runCommand(chalk, 'node ./scripts/create-tables-activity.js');
};

// Main function
(async () => {
  let chalk = await loadChalk();
  if (!chalk) {
    const answer = await promptUser(
      'Chalk (text colorizer) is not installed. Do you want to install it? (y/n): '
    );
    if (answer.toLowerCase() === 'y') {
      console.log('Installing chalk...');
      try {
        execSync('npm install chalk', { stdio: 'inherit' });
        chalk = await loadChalk();
        if (chalk) {
          console.log(chalk.green('Chalk installed successfully!'));
        }
      } catch (installError) {
        console.error('Failed to install chalk:', installError);
      }
    }
  }

  if (!chalk) {
    // Fallback to no colors if chalk couldn't be loaded
    chalk = { blue: (text) => text, green: (text) => text, red: (text) => text };
    console.log('Running without chalk colors.');
  }

  runCommands(chalk);
})();

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
