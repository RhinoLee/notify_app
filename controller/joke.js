const axios = require("axios")
const cheerio = require('cheerio');
const { randomBytes } = require("crypto");

const jokeController = {
  getJokes: async (res, req) => {
    let json;
    const api = `http://forum.gamer.com.tw/C.php`
    const params = {
      bsn: 60555,
      snA: 3105
    }
    try {
      const result = await axios.get(api, { params })
      const jokes = []
      const $ = cheerio.load(`${result.data}`);
      const q = $(".c-article__content > div").eq(3).children("div").length
      const regexpQ = /^[0-9].+/gm
      const regexpA = /^答.+/gm
      for (let i = 0; i < q; i++) {
        const textA = $(".c-article__content > div").eq(3).children("div").eq(4 * i + 1).children("font").text()
        const textQ = $(".c-article__content > div").eq(3).children("div").eq(4 * i - 1).children("font").text()
        if (Boolean(textA) && i > 0 || Boolean(textQ) && i > 0) {
          let obj = {}
          if (regexpQ.exec(textQ)) {
            obj.q = textQ.split(".")[1]
          }
          if (regexpA.exec(textA)) {
            obj.a = textA
          }

          if (obj.q && obj.a) {
            jokes.push(obj)
          }
        }
      }

      const jokesLength = jokes.length
      if (jokesLength > 0) {
        const randomNum = Math.ceil(Math.random() * jokesLength - 1)
        console.log("randomNum", randomNum);
        return jokes[randomNum]
      }
    } catch (err) {
      console.log("jokeController", err);
      return false
    }
  }
}

module.exports = jokeController

