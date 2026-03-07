import express from 'express'
import authRoute from './routes/auth.route.js'
import notFoundMiddleware from './middlewares/notFound.middleware.js'
import errorMiddleware from './middlewares/error.middleware.js'

const app = express()

app.use('/api/auth', authRoute)
app.use('/api/post', (req, res)=>{ res.send('post service')})
app.use('/api/comment',(req, res)=>{ res.send('comment service')})
app.use('/api/like',(req, res)=>{ res.send('like service')})

app.use(notFoundMiddleware)

app.use(errorMiddleware)

export default app