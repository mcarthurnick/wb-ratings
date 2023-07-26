import express from 'express';
import session from 'express-session';
import morgan from 'morgan';
import ViteExpress from 'vite-express';
import { Movie, Rating, User, db } from './src/model.js';


const app = express();
const port = '8000';
ViteExpress.config({ printViteDevServerHost: true });

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({ secret: 'ssshhhhh', saveUninitialized: true, resave: false }));


function loginRequired(req, res, next) {
    if(!req.session.userId) {
        res.status(401).json({ error: 'Unauthorized' });
    } else {
        next()
    }
}


// View a list of all movies
app.get('/api/movies', async (req, res) => {
    const movieList = await Movie.findAll();
    res.json(movieList)
})

// View details about one movie
app.get('/api/movies/:movieId', async (req, res) => {
    const movie = await Movie.findOne({ where: { movieId: req.params.movieId} })
    res.json(movie)

})

// Log in with an existing user account
app.post('/api/auth', async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({ where: { email: email  }})

    if(user && user.password === password){
        req.session.userId = user.userId;
        res.json({ success: true })
    } else {
        res.json( { success: false } )
    }
})

app.post('/api/logout', loginRequired, (req, res) => {
    req.session.destroy();
    res.json({ succcess: true })
})

app.get('/api/ratings', loginRequired, async (req, res) => {
    const user = await User.findByPk(req.session.userId);
    const ratings = await user.getRatings({
        include: {
            model: Movie,
            attributes: ['title']
        }
    })
    res.json(ratings);
})

app.post('/api/ratings', loginRequired, async (req, res) => {
    const {movieId, score} = req.body;
    const user = await User.findByPk(req.session.userId)
    const rating = await user.createRating({
        movieId: movieId,
        score: score
        })
        res.json(rating)
})



ViteExpress.listen(app, port, () => console.log(`Server is listening on http://localhost:${port}`));
