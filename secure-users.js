const fs = require("fs");
const os = require("os");
const readline = require("readline");
const CryptoJS = require("crypto-js");
const path = require("path");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const getFilename = () => {
  const now = new Date();
  return `${now.toISOString().replace(/:/g, "-").split(".")[0]}.txt`;
};

const bytesToMB = (bytes) => {
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
};

const getSystemInfo = () => {
  return {
    os: `${os.type()} ${os.release()}`,
    cpu: `${os.cpus()[0].model} (${os.arch()})`,
    totalMemory: bytesToMB(os.totalmem()),
    freeMemory: bytesToMB(os.freemem()),
    workingDirectory: process.cwd(),
    hostname: os.hostname(),
    platformVersion: os.version(),
    systemUptime: `${(os.uptime() / 3600).toFixed(2)} heures`,
    cpuCores: os.cpus().length,
    userInfo: os.userInfo().username,
    networkInterfaces: Object.keys(os.networkInterfaces()).join(", "),
    nodeVersion: process.version,
    launchArguments: process.argv.join(" "),
  };
};

const encryptPassword = (password) => {
  const secretKey = "MaCleSecrete2004";
  return CryptoJS.AES.encrypt(password, secretKey).toString();
};

rl.question("Entrez le nom d'utilisateur : ", (username) => {
  rl.question("Entrez le mot de passe : ", (password) => {
    const encryptedPassword = encryptPassword(password);
    const systemInfo = getSystemInfo();
    const filename = getFilename();

    const fileContent = `
=== Fichier de configuration securise ===
Date de création: ${new Date().toISOString()}
Nom d'utilisateur: ${username}
Mot de passe chiffré: ${encryptedPassword}

=== Informations système détaillées ===
OS: ${systemInfo.os}
Version OS: ${systemInfo.platformVersion}
Hostname: ${systemInfo.hostname}
CPU: ${systemInfo.cpu}
Coeurs CPU: ${systemInfo.cpuCores}
Architecture: ${systemInfo.cpu.split("(")[1].replace(")", "")}
Mémoire totale: ${systemInfo.totalMemory}
Mémoire libre: ${systemInfo.freeMemory}
Uptime système: ${systemInfo.systemUptime}
Utilisateur: ${systemInfo.userInfo}
Interfaces réseau: ${systemInfo.networkInterfaces}
Répertoire de travail: ${systemInfo.workingDirectory}
Version Node.js: ${systemInfo.nodeVersion}
Arguments de lancement: ${systemInfo.launchArguments}
`;

    fs.writeFile(filename, fileContent.trim(), (err) => {
      if (err) throw err;
      console.log(`Fichier ${filename} créé avec succès!`);
      rl.close();
    });
  });
});
