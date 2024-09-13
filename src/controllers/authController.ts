
import { Request, Response } from 'express';
import { comparePassword, hashPassword } from '../services/password.service';
import Prisma from '../models/user';
import { generateToken } from '../services/auth.service';


export const register = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    
    try {

        if (!email || !password) {
            res.status(400).json({message:'Email y password son requeridos'})
        return;
    }
        
            
        
        const hashedPassword = await hashPassword(password);

        console.log(hashedPassword);
        const user = await Prisma.create({

            data: {
                email,
                password: hashedPassword
            }
        }
        );

        const token = generateToken(user)
        res.status(201).json({ token });



    } catch (error:any) {

        console.log(error);

        // TODO MEJORAR LOS ERRORES
      
        if (error?.code === 'P2002' && error?.meta?.target?.includes('email')) {
            res.status(400).json({ message: 'Email ya existe' });
        }

        

        console.log(error);
        res.status(500).json({ error: 'Error en el registro' });
    }

}

export const login = async (req: Request, res: Response): Promise<void> => {

    const { email, password } = req.body;


    try {
      
    const user = await Prisma.findUnique({where: {email}});
    if (!user) {
        res.status(404).json({error: 'Usuario no coincide'});
        return;

    }
            //compaarador de contraseña
      const passwordMatch = await comparePassword  (password, user.password);
        if (!passwordMatch) {
            res.status(401).json({error: 'Usuario y Contraseña no coinciden'});
            return;
    
        }
        const token = generateToken(user);
        res.status(200).json({token});

      
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Error en el login'});


    }
}