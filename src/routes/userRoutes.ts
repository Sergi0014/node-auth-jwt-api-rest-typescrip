import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from '../controllers/usersController'
import  Express, {NextFunction, Request, Response}  from "express";
import jwt from 'jsonwebtoken';

const router = Express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'default-secret';


//middleware de jwt para ver si esta autenticado

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(!token){
        return res.sendStatus(401).json({error: 'No autorizado'})
    }
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if(err){
            console.error("error en la verificacion del token", err)
            return res.sendStatus(403).json({error: 'No autorizado'})
        }

        next();

    })
}

router.post('/', authenticateToken, createUser)
router.get('/', authenticateToken, getAllUsers)
router.get('/:id', authenticateToken, getUserById)
router.put('/:id', authenticateToken, updateUser)
router.delete('/:id', authenticateToken,deleteUser)


export default router;