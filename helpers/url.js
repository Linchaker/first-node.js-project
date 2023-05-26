http = require('http')
URL = require('url')

class Url {
    static check (path) {
      return new Promise((resolve, reject) => {
        try {
          // Проверяем, является ли URL действительным
          new URL(path);
          resolve(true)
        } catch (error) {
          resolve(false);
          return;
        }
        
        
      });
    }
}

module.exports = Url