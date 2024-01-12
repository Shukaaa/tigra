const tigraPrefix = (emoji, color) =>  {
    return `${emoji} TIGRA:`[color].underline + " ";
}

const tigraLog = (message) => {
    console.log(tigraPrefix("🐯", "white") + message);
}

const tigraError = (message) => {
    console.log(tigraPrefix("❌ ", "red") + message.red);
}

const tigraWarning = (message) => {
    console.log(tigraPrefix("⚠️", "yellow") + message.yellow);
}

const tigraSuccess = (message) => {
    console.log(tigraPrefix("✅ ", "green") + message.green);
}

const tigraInfo = (message) => {
    console.log(tigraPrefix("ℹ️", "blue") + message.blue);
}

module.exports = {
    tigraLog,
    tigraError,
    tigraWarning,
    tigraSuccess,
    tigraInfo
}