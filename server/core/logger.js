// core/logger.js - ENHANCED
const fs = require("fs");
const path = require("path");

const logDir = path.join(__dirname, "../logs");
const logFile = path.join(logDir, "app.log");
const errorLogFile = path.join(logDir, "error.log");

// Ensure logs folder exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Log rotation - Keep logs manageable
const MAX_LOG_SIZE = 5 * 1024 * 1024; // 5MB

const rotateLog = (filePath) => {
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    if (stats.size > MAX_LOG_SIZE) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = filePath.replace('.log', `-${timestamp}.log`);
      fs.renameSync(filePath, backupPath);
      // Keep only last 5 backups
      const files = fs.readdirSync(logDir)
        .filter(f => f.startsWith('app-') && f.endsWith('.log'))
        .sort();
      while (files.length > 5) {
        const oldFile = files.shift();
        fs.unlinkSync(path.join(logDir, oldFile));
      }
    }
  }
};

const log = (level, message, meta = null) => {
  const time = new Date().toISOString();
  let logMessage = `[${time}] [${level.toUpperCase()}] ${message}`;
  
  if (meta) {
    logMessage += ` | ${JSON.stringify(meta)}`;
  }
  logMessage += "\n";

  // Rotate logs if needed
  rotateLog(logFile);
  if (level === 'error') {
    rotateLog(errorLogFile);
  }

  // Write to file
  try {
    const targetFile = level === 'error' ? errorLogFile : logFile;
    fs.appendFileSync(targetFile, logMessage);
  } catch (err) {
    console.error('Failed to write to log file:', err);
  }

  // Also log to console with colors
  const colors = {
    info: '\x1b[36m',  // Cyan
    warn: '\x1b[33m',  // Yellow
    error: '\x1b[31m', // Red
    debug: '\x1b[35m'  // Magenta
  };
  const reset = '\x1b[0m';
  console.log(`${colors[level] || ''}${logMessage.trim()}${reset}`);
};

const logger = {
  info: (msg, meta) => log("info", msg, meta),
  warn: (msg, meta) => log("warn", msg, meta),
  error: (msg, meta) => log("error", msg, meta),
  debug: (msg, meta) => log("debug", msg, meta),
  
  // For API requests
  request: (req) => {
    const meta = {
      method: req.method,
      url: req.url,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.headers['user-agent'],
      userId: req.user?._id || 'anonymous'
    };
    logger.info(`${req.method} ${req.url}`, meta);
  },
  
  // For database operations
  db: (operation, collection, meta = {}) => {
    logger.debug(`DB: ${operation} on ${collection}`, meta);
  },
  
  // For performance tracking
  performance: (operation, duration) => {
    logger.info(`⏱️ ${operation} took ${duration}ms`);
  }
};

module.exports = logger;