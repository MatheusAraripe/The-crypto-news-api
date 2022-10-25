const PORT = process.env.PORT || 3000

const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const app = express()

const newspapers = [
    {
        name: 'standard',
        address: 'https://www.standard.co.uk/esmoney/investing/cryptocurrency',
        base: 'https://www.standard.co.uk/'
    },
    {
        name: 'nytimes',
        address: 'https://www.nytimes.com/search?query=cryptocurrency',
        base: 'https://www.nytimes.com'
    },
    {
        name: 'bbc',
        address: 'https://www.bbc.co.uk/search?q=cryptocurrency&page=1',
        base: ''
    },
    {
        name: 'week',
        address: 'https://theweek.com/search/cryptocurrency',
        base: 'https://theweek.com'
    },
    {
        name: 'times',
        address: 'https://www.thetimes.co.uk/search?source=nav-desktop&q=cryptocurrency',
        base: 'https://www.thetimes.co.uk'
    },
    {
        name: 'telegraph',
        address: 'https://www.telegraph.co.uk/cryptocurrency/',
        base: 'https://www.telegraph.co.uk'
    },
    {
        name: 'cityam',
        address: 'https://www.cityam.com/?s=cryptocurrency',
        base: ''
    },
    {
        name: 'latimes',
        address: 'https://www.latimes.com/search?q=cryptocurrency',
        base: ''
    },
    {
        name: 'nypost',
        address: 'https://nypost.com/search/cryptocurrency/',
        base: ''
    }
]

const articles = []

newspapers.forEach(newspaper =>{
    axios.get(newspaper.address)
    .then((response) => {
        const html = response.data
        const $ = cheerio.load(html)

        $('a:contains("crypto")', html).each(function () {
            const title = $(this).text()
            const url = $(this).attr('href')

            articles.push({
            title,
            url: newspaper.base + url,
            source: newspaper.name
            })
        })
    })
})


app.get('/', (req, res) => {
    res.json("The crypto news API")
})

app.get('/news', (req, res) => {
    res.json(articles)
})

app.get('/news/:newspaperId', async (req, res) => {
    const newspaperId = req.params.newspaperId

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base

    axios.get(newspaperAddress)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        const specificArticles = []

        $('a:contains("crypto")', html).each(function () {
            const title = $(this).text()
            const url = $(this).attr('href')
            specificArticles.push({
                title,
                url: newspaperBase + url,
                source: newspaperId
            })
        })
        res.json(specificArticles)
    }).catch(err => console.log(err))
})
app.listen(PORT, () => console.log(`app runing on PORT ${PORT}`))