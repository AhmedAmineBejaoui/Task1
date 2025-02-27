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
  try {
    return {
      os: `${os.type()} ${os.release()}`,
      cpu: os.cpus().length > 0 ? `${os.cpus()[0].model} (${os.arch()})` : "Inconnu",
      totalMemory: bytesToMB(os.totalmem()),
      freeMemory: bytesToMB(os.freemem()),
      workingDirectory: process.cwd(),
      hostname: os.hostname(),
      platformVersion: os.version ? os.version() : "Inconnu",
      systemUptime: `${(os.uptime() / 3600).toFixed(2)} heures`,
      cpuCores: os.cpus().length,
      userInfo: os.userInfo().username || "Inconnu",
      networkInterfaces: Object.keys(os.networkInterfaces() || {}).join(", ") || "Inconnu",
      nodeVersion: process.version,
      launchArguments: process.argv.join(" "),
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des informations système:", error);
    return {};
  }
};

const encryptPassword = (password) => {
  try {
    const secretKey = "MaCleSecrete2004";
    return CryptoJS.AES.encrypt(password, secretKey).toString();
  } catch (error) {
    console.error("Erreur lors du chiffrement du mot de passe:", error);
    return "Erreur de chiffrement";
  }
};

const askQuestion = (query) => {
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      resolve(answer.trim());
    });
  });
};

(async () => {
  try {
    const username = await askQuestion("Entrez le nom d'utilisateur : ");
    const password = await askQuestion("Entrez le mot de passe : ");
    rl.close();
    
    if (!username || !password) {
      throw new Error("Le nom d'utilisateur et le mot de passe ne peuvent pas être vides.");
    }

    const encryptedPassword = encryptPassword(password);
    const systemInfo = getSystemInfo();
    const filename = getFilename();

    const fileContent = `
=== Fichier de configuration sécurisé ===
Date de création: ${new Date().toISOString()}
Nom d'utilisateur: ${username}
Mot de passe chiffré: ${encryptedPassword}

=== Informations système détaillées ===
OS: ${systemInfo.os}
Version OS: ${systemInfo.platformVersion}
Hostname: ${systemInfo.hostname}
CPU: ${systemInfo.cpu}
Coeurs CPU: ${systemInfo.cpuCores}
Architecture: ${systemInfo.cpu.split("(")[1]?.replace(")", "") || "Inconnu"}
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
      if (err) {
        console.error("Erreur lors de l'écriture du fichier:", err);
      } else {
        console.log(`Fichier ${filename} créé avec succès!`);
      }
    });
  } catch (error) {
    console.error("Une erreur est survenue:", error.message);
    rl.close();
  }
})();

