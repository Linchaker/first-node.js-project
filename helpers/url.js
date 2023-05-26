http = require('http')
URL = require('url')

class Url {
    static check (path) {
      return new Promise((resolve, reject) => {
        try {
          // Проверяем, является ли URL действительным
          new URL(path);
        } catch (error) {
          resolve(false);
          return;
        }
        
        http.get(url, (response) => {
          const { statusCode } = response;
    
          if (statusCode === 200) {
            // Ссылка доступна
            resolve(true);
          } else {
            // Ссылка не доступна
            resolve(false);
          }
        }).on('error', (error) => {
          // Ошибка при проверке доступности ссылки
          reject(error);
        });
      });
    }
}

module.exports = Url