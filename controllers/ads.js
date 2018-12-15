const Ads = require('../models/ads')
const shuffle = require('../helpers/development/shuffle')

class Controller {
    static addAds(req, res) {
        Ads
            .create({
                link: req.body.link
            })
            .then(ad => {
                res.status(200).json(ad)
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({message: err.message})
            })
    }
    static getAds(req, res) {
        Ads
            .find()
            .then(ads => {
                shuffle(ads)
                let limitedAd= []
                let counter = 0
                //limi number of ads shown to only 3
                ads.forEach(ad => {
                    if(counter < 3) {
                        limitedAd.push(ad)
                        counter ++ 
                    }
                })
                res.status(200).json(limitedAd)
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({message: err.message})
            })
    }
}

module.exports = Controller