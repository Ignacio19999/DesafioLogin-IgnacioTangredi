const { Router } = require('express')
const passport = require('passport');
const User = require('../models/user.model')

const router = Router()

router.post('/login', async (req, res) => {
    console.log (req.body)

    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ error: 'email o contraseña incorrecta'})
    }

    const user = await User.findOne({ email, password })
    if(!user) {
        return res.status(400).json({ error: 'usuario no encontrado'})
    }

    req.session.user = { email, _id: user._id.toString() }
    res.redirect('/')
})

router.get('/logout', (req, res) => {
    req.session.destroy(_ => {
        res.redirect('/')
    })
})

router.post('/register', async (req, res) => {
    console.log(req.body)

    try {
        const { firstName, lastName, age, email, password } = req.body
        
        const user = await User.create({
            firstName,
            lastName,
            age: +age,
            email,
            password: age,
        })

        req.session.user = { email, _id: user._id.toString()}
        res.redirect('/')
    } catch (err) {
        return res.status(500).json({ error: err })
    }
})

router.get('/auth/github',
  passport.authenticate('github'));

router.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/profile');
  })

module.exports = router