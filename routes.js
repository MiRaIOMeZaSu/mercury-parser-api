const Router = require('express').Router;
const router = new Router();
const Mercury = require('@postlight/mercury-parser');
const URL = require('url');
router.route('/').get((req, res) => {
    res.json({
        message: 'Welcome to 🚀mercury-parser-api API! Endpoint: /parser',
    });
});

function get_domain(url) {
    url = URL.parse(url);
    let arr = url.hostname.split(".");
    arr = ["domain"].concat(arr.slice(-2));
    let domain = arr.join("_");
    return domain;
}

router.route('/parser').get(async (req, res) => {
    let result = { message: 'No URL was provided' };
    if (req.query.url) {
        try {
            const contentType = req.query.contentType || 'html';
            let headers = new Object();
            if (typeof req.query.headers !== 'undefined') {
                headers = JSON.parse(req.query.headers);
            } else if (process.env[get_domain(req.query.url)]) {
                headers = JSON.parse(process.env[get_domain(req.query.url)]);
            }
            result = await Mercury.parse(req.query.url, {
                contentType,
                headers,
            });
        } catch (error) {
            result = { error: true, messages: error.message };
        }
    }
    return res.json(result);
});

module.exports = router;