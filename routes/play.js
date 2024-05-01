const express = require('express');
const util = require('../config/util.js');
const router = express.Router();
const { Web3 } = require('web3');

const web3 = new Web3('https://bsc-dataseed1.binance.org/');
const contractABI = [
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            },
            {
                "name": "_spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "name": "remaining",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
];

const contractAddress = '0x4691f60c894d3f16047824004420542e4674e621';
const contract = new web3.eth.Contract(contractABI, contractAddress);

router.get('/', function(req, res) {
    res.render('partials/play', {
        title: 'Chess Hub - Game',
        user: req.user,
        isPlayPage: true
    });
});

router.post('/', function(req, res) {
    var side = req.body.side;
    //var opponent = req.body.opponent; // playing against the machine in not implemented
    var token = util.randomString(20);
    console.log("play post");
    res.redirect('/game/' + token + '/' + side);
});

router.get("/allowance", async (req, res) => {
    try {
        if(req.query.user && req.query.spender) {
            let funcName = 'allowance';
            let funcParams = [
                req.query.user,
                req.query.spender
            ];
            let result = await contract.methods[funcName](...funcParams).call();
            res.send(result.toString());
        } else {
            res.status(400).send('user and spender params are required');
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Expected error, check server log for more info")
    }
})

module.exports = router;