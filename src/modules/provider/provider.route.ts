import express, { Router } from "express"
import { providerController } from "./provider.controller"
import auth, { userRole } from "../../middlewares/auth"

const router = express.Router()

router.post('/provider', providerController.createProvider)

router.get('/provider', providerController.getAllProvider)

router.get('/provider/:id', providerController.getSingleProvider)

router.get('/providerbyemail/:email', providerController.getProviderByEmail)

router.put('/edit-Provider/:id', auth(userRole.PROVIDER), providerController.updateProvider)


export const providerRouter: Router = router